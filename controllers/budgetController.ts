import { Types } from "mongoose";
import { Request, Response, NextFunction, Router } from "express";
import { Budget } from "./../models/Budget";
import { checkBody } from "../utils/checkBody";
import { AppError } from "./../utils/appError";
import {
	controller,
	post,
	patch,
	use,
	get,
	catchAsync,
	del
} from "../decorators";
import { requireAuth } from "../middlewares/requireAuth";
import { bodyValidator } from "../middlewares/bodyValidator";

export const budgetRoute = Router();

@controller("/budget", budgetRoute)
class budgetController {
	@post("/new")
	@use(requireAuth, bodyValidator("name", "categories", "startingBalance"))
	@catchAsync
	async newBudget(req: Request, res: Response, next: NextFunction) {
		interface ReqBody {
			name: string;
			categories: string[];
			startingBalance: number;
		}
		const { categories, name, startingBalance }: ReqBody = req.body;
		// Member will have to declare categories beforehand or update budget

		if (req.session) {
			const budget = await Budget.create({
				categories,
				name,
				startingBalance,
				user: req.session.userId
			});
			// Send only the new budget to the client
			// Client will update the store state
			// Starts with empty transaction

			res.status(200).json(budget);
		} else return next(new AppError("User no longer logged in", 403));
	}

	// For updating categories,name, startingBalance of budget
	@patch("/update/:id")
	@use(requireAuth)
	@catchAsync
	async updateBudget(req: Request, res: Response, next: NextFunction) {
		if (req.session) {
			interface ReqBody {
				name: string;
				categories: string;
			}
			const filterBody: ReqBody = checkBody(
				req.body,
				["name", "categories", "startingBalance"],
				next
			);

			// Find and check budget exist
			// Make sure its from user logged in
			// Update budget
			const budget = await Budget.findOneAndUpdate(
				{
					_id: req.params.id,
					user: req.session.userId
				},
				filterBody,
				{
					new: true,
					runValidators: true
				}
			);
			if (!budget) return next(new AppError("No budget found.", 404));

			// Update each transactions category if it was changed!
			// Or prevent user from deleting categories!
			if (req.body.categories.length < budget.categories.length) {
				return next(new AppError("Budget categories cannot be deleted!", 400));
			}

			// Update budget's balance if startingBalance was changed
			// Update each transaction's balance also
			if (req.body.startingBalance) {
				budget.balance = budget.startingBalance;
				budget.transactions.forEach(t => {
					t.balance = budget.balance + t.amount;
					budget.balance += t.amount;
				});
				// Save updated budget
				await budget.save();
			}

			// Return updated budget list to the client
			// Client updates entire store state
			// Reduces the work client needs to do
			const budgetsList = await Budget.find({
				user: req.session.userId
			}).select("-transactions -user -__v");
			res.status(200).json(budgetsList);
		} else return next(new AppError("User no longer logged in", 403));
	}

	@get("/all")
	@use(requireAuth)
	@catchAsync
	async getAllBudget(req: Request, res: Response, next: NextFunction) {
		// Get all budget for user
		if (req.session) {
			const budgetsList = await Budget.find({
				user: req.session.userId
			}).select("-transactions -user -__v");
			if (!budgetsList || budgetsList.length === 0)
				return next(
					new AppError("User does not have any budgets connected", 404)
				);
			res.status(200).json(budgetsList);
		} else return next(new AppError("User no longer logged in", 403));
	}

	// Transaction will be a separate request
	@get("/:id")
	@use(requireAuth)
	@catchAsync
	async getBudget(req: Request, res: Response, next: NextFunction) {
		if (req.session) {
			const budget = await Budget.findOne({
				_id: req.params.id,
				user: req.session.userId
			}).select("-transactions -user -__v");
			if (!budget)
				return next(new AppError("No budget belongs to the id", 404));
			res.status(200).json(budget);
		} else return next(new AppError("User no longer logged in", 403));
	}

	@del("/del/:id")
	@use(requireAuth)
	@catchAsync
	async deleteBudget(req: Request, res: Response, next: NextFunction) {
		if (req.session) {
			const budget = await Budget.findOneAndRemove({
				_id: req.params.id,
				user: req.session.userId
			});
			if (!budget)
				return next(new AppError("No budget belongs to the id", 404));
			res.status(204).json({ success: "Budget Deleted" });
		} else return next(new AppError("User no longer logged in", 403));
	}

	// get method
	// group by categoryindex
	// display income and expenses
	// Need annual category data

	@get("/categories/:budgetId/year/:year")
	@use(requireAuth)
	@catchAsync
	async getAnnualCategoryData(req: Request, res: Response, next: NextFunction) {
		const data = await Budget.aggregate([
			{
				$match: {
					_id: Types.ObjectId(req.params.budgetId)
				}
			},
			{
				$unwind: "$transactions"
			},
			{
				$sort: {
					"transactions.date": -1
				}
			},
			{
				$project: {
					transactions: 1,
					year: {
						$year: "$transactions.date"
					},
					income: {
						$cond: {
							if: {
								$gte: ["$transactions.amount", 0]
							},
							then: "$transactions.amount",
							else: 0
						}
					},
					expense: {
						$cond: {
							if: {
								$lt: ["$transactions.amount", 0]
							},
							then: "$transactions.amount",
							else: 0
						}
					}
				}
			},
			{
				$match: {
					year: parseInt(req.params.year, 10)
				}
			},
			{
				$group: {
					_id: {
						category: "$transactions.categoryIndex"
					},
					income: {
						$sum: "$income"
					},
					expense: {
						$sum: "$expense"
					}
				}
			},

			{
				$sort: {
					"_id.category": 1
				}
			}
		]);
		res.status(200).json(data);
	}

	@get("/categories/:budgetId/month/:month/year/:year")
	@use(requireAuth)
	@catchAsync
	async getCategories(req: Request, res: Response, next: NextFunction) {
		const budget = await Budget.aggregate([
			{
				$match: {
					_id: Types.ObjectId(req.params.budgetId)
				}
			},
			{
				$unwind: "$transactions"
			},
			{
				$sort: {
					"transactions.date": -1
				}
			},
			{
				$project: {
					transactions: 1,
					month: {
						$month: "$transactions.date"
					},
					year: {
						$year: "$transactions.date"
					},
					income: {
						$cond: {
							if: {
								$gte: ["$transactions.amount", 0]
							},
							then: "$transactions.amount",
							else: 0
						}
					},
					expense: {
						$cond: {
							if: {
								$lt: ["$transactions.amount", 0]
							},
							then: "$transactions.amount",
							else: 0
						}
					}
				}
			},
			{
				$match: {
					month: parseInt(req.params.month, 10),
					year: parseInt(req.params.year, 10)
				}
			},
			{
				$group: {
					_id: {
						month: "$month",
						year: "$year",
						category: "$transactions.categoryIndex"
					},
					income: {
						$sum: "$income"
					},
					expense: {
						$sum: "$expense"
					}
				}
			},

			{
				$sort: {
					"_id.category": 1
				}
			}
		]);
		res.status(200).json(budget);
	}

	@get("/stats/:budgetId/year/:year")
	@use(requireAuth)
	@catchAsync
	async getStats(req: Request, res: Response, next: NextFunction) {
		// Only show balance,income,expense
		const stats = await Budget.aggregate([
			{
				$match: {
					_id: Types.ObjectId(req.params.budgetId)
				}
			},
			{
				$unwind: "$transactions"
			},
			{
				$sort: {
					"transactions.date": -1
				}
			},
			{
				$project: {
					transactions: 1,
					month: {
						$month: "$transactions.date"
					},
					year: {
						$year: "$transactions.date"
					},
					income: {
						$cond: {
							if: {
								$gte: ["$transactions.amount", 0]
							},
							then: "$transactions.amount",
							else: 0
						}
					},
					expense: {
						$cond: {
							if: {
								$lt: ["$transactions.amount", 0]
							},
							then: "$transactions.amount",
							else: 0
						}
					}
				}
			},
			{
				$match: {
					year: parseInt(req.params.year, 10)
				}
			},
			{
				$group: {
					_id: {
						month: "$month",
						year: "$year"
					},
					income: {
						$sum: "$income"
					},
					expense: {
						$sum: "$expense"
					},
					balance: {
						$first: "$transactions.balance"
					}
				}
			},

			{
				$sort: {
					"_id.year": -1,
					"_id.month": -1
				}
			}
		]);
		res.status(200).json(stats);
	}

	@get("/dates/:budgetId")
	@use(requireAuth)
	@catchAsync
	async getDates(req: Request, res: Response, next: NextFunction) {
		const dates = await Budget.aggregate([
			{
				$match: {
					_id: Types.ObjectId(req.params.budgetId)
				}
			},
			{
				$unwind: "$transactions"
			},
			{
				$sort: {
					"transactions.date": -1
				}
			},
			{
				$project: {
					month: {
						$month: "$transactions.date"
					},
					year: {
						$year: "$transactions.date"
					}
				}
			},
			{
				$group: {
					_id: {
						year: "$year"
					},
					months: {
						$addToSet: "$month"
					}
				}
			},

			{
				$unwind: "$months"
			},
			{
				$sort: {
					"_id.year": -1,
					months: -1
				}
			},
			{
				$group: {
					_id: {
						year: "$_id.year"
					},
					months: {
						$push: "$months"
					}
				}
			},
			{
				$sort: {
					"_id.year": -1
				}
			}
		]);
		res.status(200).json(dates);
	}
}
