import { Request, Response, NextFunction, Router } from "express";
import { Users } from "./../models/Users";
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
				{ _id: req.params.id, user: req.session.userId },
				filterBody,
				{
					new: true,
					runValidators: true
				}
			);
			if (!budget) return next(new AppError("No budget found.", 404));

			// Update budget's balance if startingBalance was changed
			// Update each transaction's balance also
			if (req.body.startingBalance) {
				budget.balance = budget.startingBalance;
				budget.transactions.forEach(t => {
					t.balance = budget.balance + t.amount;
					budget.balance += t.amount;
				});
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
}
