import { getTransactions } from "./../utils/getTransactions";
import { Request, Response, NextFunction, Router } from "express";

import { ITransaction } from "./../interfaces/Transaction";
import { checkBody } from "./../utils/checkBody";
import { AppError } from "./../utils/appError";
import { Budget } from "./../models/Budget";
import { controller, get, patch, use, catchAsync } from "../decorators";
import { requireAuth } from "../middlewares/requireAuth";
import { bodyValidator } from "../middlewares/bodyValidator";
import { Types } from "mongoose";

export const transactionRoute = Router();

@controller("/transactions", transactionRoute)
class TransactionController {
	@patch("/new/:budgetId")
	// removed categoryIndex because value of 0 is invalid which is also an index defaults to 0 when not provided
	@use(requireAuth, bodyValidator("desc", "amount"))
	@catchAsync
	async newTransaction(req: Request, res: Response, next: NextFunction) {
		// transactions made default belonging to the user logged in
		// Only user logged in can edit their transactions made but can delete any also

		// Filter request body to make sure only allow parameters are passed
		const filterBody = checkBody(
			req.body,
			["desc", "amount", "categoryIndex", "date"],
			next
		);

		if (req.session) {
			// Add transaction to budget
			const budget = await Budget.findOne({
				_id: req.params.budgetId,
				user: req.session.userId
			});
			if (budget) {
				// create new transaction and add to budget

				const transaction: ITransaction = {
					...filterBody,
					user: req.session.userId
				};

				// Transaction date comes as a string
				// Add transaction to the budget
				budget.transactions.push(transaction);

				// Add 10 miliseconds for with default dates but if date picker was used, add the transaction's length
				// Will fail if transaction's length is millions long which is assumed unreachable
				const i = budget.transactions.length - 1;
				const ms = budget.transactions[i].date.getMilliseconds();
				budget.transactions[i].date.setMilliseconds(
					ms + (ms === 0 ? budget.transactions.length : 10)
				);

				// Update balance of budget and in transaction
				// The transactions has to be sorted by date first! Otherwise incorrect running balance will be calculated
				// Recalculate balance

				budget.balance += transaction.amount;
				budget.transactions.sort((a, b) => {
					if (a.date > b.date) return 1;
					// a , b (2nd Dec , 1st Dec)
					else return -1; // b, a
				});

				// Recalculate balance of budget and transactions
				budget.balance = budget.startingBalance;
				budget.transactions.forEach(t => {
					t.balance = budget.balance + t.amount;
					budget.balance += t.amount;
				});

				// save updated budget
				await budget.save();

				// Send updated transactions
				const transactions = await getTransactions(req);
				res.status(201).json(transactions);
			} else return next(new AppError("Budget not found", 404));
		} else return next(new AppError("User no longer logged in", 403));
	}

	@patch("/update/:budgetId/:transactionId")
	@use(requireAuth)
	@catchAsync
	async updateTransaction(req: Request, res: Response, next: NextFunction) {
		if (req.session) {
			// Using a method where most logic for finding index and updating is fulfilled by database queries instead of server

			// Find the Budget then transaction to be updated
			// Required to get the transaction length
			interface FindBudget {
				count: number;
				transactions: ITransaction;
				categories: string[];
			}
			const aggregateBudgets: FindBudget[] = await Budget.aggregate([
				{
					$match: {
						_id: Types.ObjectId(req.params.budgetId)
					}
				},
				{
					$project: {
						categories: 1,
						transactions: 1,
						count: { $size: "$transactions" }
					}
				},
				{
					$unwind: "$transactions"
				},
				{
					$match: {
						"transactions._id": Types.ObjectId(req.params.transactionId)
					}
				}
			]);
			// Doesnt work with aggregation
			// if (aggregateBudgets.length === 0)
			// 	return next(new AppError("Budget or transaction not found", 404));

			const findBudget = aggregateBudgets[0];

			// Replace the transaction values with req.body
			// Replace values in current transaction
			let transaction = findBudget.transactions;

			// forEach key values does not work because string type keys cannot be indexed to redefine object
			// This method does not require a filter checkBody
			if (req.body.desc) transaction.desc = req.body.desc;
			if (req.body.date) transaction.date = new Date(req.body.date);
			if (req.body.amount) transaction.amount = req.body.amount;
			if (req.body.categoryIndex)
				transaction.categoryIndex = req.body.categoryIndex;

			// Check if category is valid (when using update)
			const validCategory =
				findBudget.categories.length > transaction.categoryIndex;
			if (!validCategory) return next(new AppError("Invalid category", 400));

			// Fix the date for calculating budget purposes
			// Set req.body.date as a Date object - mongoDB assumed to update format
			// Adding milliseconds ensures that the updating transaction's date is the newest and in order(prevent same dates)
			//findBudget.transactions.length === 1 everytime

			const ms = transaction.date.getMilliseconds();
			transaction.date.setMilliseconds(ms + (ms === 0 ? findBudget.count : 10));

			// Find the one transaction using indexing and update it
			// The dollar represents the first matching array key index
			const budget = await Budget.findOneAndUpdate(
				{
					_id: req.params.budgetId,
					user: req.session.userId,
					"transactions._id": req.params.transactionId
				},
				{
					$set: {
						"transactions.$": transaction
					}
				},
				{
					new: true,
					runValidators: true
				}
			);

			if (budget) {
				// May need to update all the balance of each transaction
				// Count each balance again

				// Sort transactions first by date (oldest to newest!)
				budget.transactions.sort((a, b) => {
					if (a.date > b.date) return 1;
					// a , b (2nd Dec , 1st Dec)
					else return -1; // b, a
				});

				// Recalculate balance of budget and transactions
				budget.balance = budget.startingBalance;
				budget.transactions.forEach(t => {
					t.balance = budget.balance + t.amount;
					budget.balance += t.amount;
				});

				await budget.save();

				// Send updated transactions
				const transactions = await getTransactions(req);
				res.status(200).json(transactions);
			} else return next(new AppError("Budget or transaction not found", 404));
		} else return next(new AppError("User no longer logged in", 403));
	}

	@get("/:budgetId")
	@use(requireAuth)
	@catchAsync
	async getAllTransactions(req: Request, res: Response, next: NextFunction) {
		const transactions = await getTransactions(req);
		res.status(200).json(transactions);
	}

	@patch("/delete/:budgetId/:transactionId")
	@use(requireAuth)
	@catchAsync
	async deleteTransaction(req: Request, res: Response, next: NextFunction) {
		// Deletes a transaction and returns the updated budget
		// Pull the transaction matching the query from the budget

		// Need to update all balances of budget after the transaction deleted
		// Need to update budget's balance
		if (req.session) {
			const budget = await Budget.findOneAndUpdate(
				{
					_id: req.params.budgetId,
					user: req.session.userId,
					"transactions._id": req.params.transactionId
				},
				{
					$pull: {
						transactions: { _id: req.params.transactionId }
					}
				},
				{
					new: true,
					runValidators: true
				}
			);
			// Update every transaction's balance
			if (budget) {
				// Recalculate balance
				budget.transactions.sort((a, b) => {
					if (a.date > b.date) return 1;
					// a , b (2nd Dec , 1st Dec)
					else return -1; // b, a
				});

				// Recalculate balance of budget and transactions
				budget.balance = budget.startingBalance;
				budget.transactions.forEach(t => {
					t.balance = budget.balance + t.amount;
					budget.balance += t.amount;
				});

				// save updated budget
				await budget.save();

				// Send updated transactions
				const transactions = await getTransactions(req);
				res.status(200).json(transactions);
			} else return next(new AppError("Budget or transaction not found", 404));
		} else return next(new AppError("User no longer logged in", 403));
	}

	// Get transactions by budget id, year, month

	@get("/:budgetId/month/:month/year/:year")
	@use(requireAuth)
	@catchAsync
	async getMonthTransactions(req: Request, res: Response, next: NextFunction) {
		const transactions = await Budget.aggregate([
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
						year: "$year"
					},
					transactions: {
						$push: "$transactions"
					}
				}
			}
		]);
		res.status(200).json(transactions);
	}
}
