import { Request, Response, NextFunction, Router } from "express";

import { ITransaction } from "./../interfaces/Transaction";
import { checkBody } from "./../utils/checkBody";
import { AppError } from "./../utils/appError";
import { Budget } from "./../models/Budget";
import { controller, get, patch, use, catchAsync } from "../decorators";
import { requireAuth } from "../middlewares/requireAuth";
import { bodyValidator } from "../middlewares/bodyValidator";
import { Types } from "mongoose";

/// MUCH BETTER TO CREATE A NEW MODEL FOR TRANSACTIONS

export const transactionRoute = Router();

@controller("/transactions", transactionRoute)
class TransactionController {
	@patch("/new/:budgetId")
	@use(requireAuth, bodyValidator("desc", "category", "amount"))
	@catchAsync
	async newTransaction(req: Request, res: Response, next: NextFunction) {
		// transactions made default belonging to the user logged in
		// Only user logged in can edit their transactions made but can delete any also

		// Filter request body to make sure only allow parameters are passed
		const filterBody: ITransaction = checkBody(
			req.body,
			["desc", "amount", "category"],
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
				// Update balance of budget and in transaction
				budget.balance += transaction.amount;
				transaction.balance = budget.balance;

				// Add transaction to the budget
				budget.transactions.push(transaction);

				// save updated budget
				await budget.save();

				// Send updated transactions
				res.status(201).json(budget.transactions);
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
			const findBudget = await Budget.findOne(
				{
					_id: req.params.budgetId,
					user: req.session.userId,
					"transactions._id": req.params.transactionId
				},
				{
					balance: 1,
					categories: 1,
					transactions: { $elemMatch: { _id: req.params.transactionId } }
				}
			);
			if (!findBudget)
				return next(new AppError("Budget or transaction not found", 404));

			// Replace the transaction values with req.body
			// Replace values in current transaction
			let transaction = findBudget.transactions[0];

			// forEach key values does not work because string type keys cannot be indexed to redefine object
			// This method does not require a filter checkBody
			if (req.body.desc) transaction.desc = req.body.desc;
			if (req.body.date) transaction.date = req.body.date;
			if (req.body.amount) transaction.amount = req.body.amount;
			if (req.body.category) transaction.category = req.body.category;

			// Check if category is valid
			const i = findBudget.categories.findIndex(
				el => el === transaction.category
			);
			if (i < 0) return next(new AppError("Invalid category", 400));

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
				budget.balance = budget.startingBalance;
				budget.transactions.forEach(t => {
					t.balance = budget.balance + t.amount;
					budget.balance += t.amount;
				});

				const updatedBudget = await budget.save();

				// Send updated transactions
				res.status(200).json(updatedBudget.transactions);
			} else return next(new AppError("Budget or transaction not found", 404));
		} else return next(new AppError("User no longer logged in", 403));
	}

	@get("/:budgetId")
	@use(requireAuth)
	@catchAsync
	async getAllTransactions(req: Request, res: Response, next: NextFunction) {
		if (req.session) {
			if (!req.query.page || !req.query.limit) {
				res.status(200).json(await Budget.findById(req.params.budgetId));
			}
			interface Query {
				page: string;
				limit: string;
			}

			let { page, limit }: Query = req.query;

			// Define pagination
			const limitPerPage = parseInt(limit, 10);
			const skip = (parseInt(page, 10) - 1) * limitPerPage;

			// Only shows transactions of the budget
			const transactions = await Budget.aggregate([
				{ $match: { _id: Types.ObjectId(req.params.budgetId) } },
				{ $unwind: "$transactions" },
				{ $skip: skip },
				{ $limit: limitPerPage },
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
					$group: {
						_id: {
							month: "$month",
							year: "$year"
						},
						transactions: { $push: "$transactions" }
					}
				},

				{
					$sort: { "_id.year": -1, "_id.month": -1 }
				}
			]);

			res.status(200).json(transactions);
		} else return next(new AppError("User no longer logged in", 403));
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
				budget.balance = budget.startingBalance;
				budget.transactions.forEach(t => {
					t.balance = budget.balance + t.amount;
					budget.balance += t.amount;
				});

				const updatedBudget = await budget.save();
				// Send updated transactions

				res.status(200).json(updatedBudget.transactions);
			} else return next(new AppError("Budget or transaction not found", 404));
		} else return next(new AppError("User no longer logged in", 403));
	}
}
