import { ITransaction } from "./../interfaces/Transaction";
import { checkBody } from "./../utils/checkBody";
import { AppError } from "./../utils/appError";
import { Budget } from "./../models/Budget";
import { Request, Response, NextFunction, Router } from "express";
import { controller, post, del, patch, use, catchAsync } from "../decorators";
import { requireAuth } from "../middlewares/requireAuth";
import { bodyValidator } from "../middlewares/bodyValidator";

/// MUCH BETTER TO CREATE A NEW MODEL FOR TRANSACTIONS

export const transactionRoute = Router();

@controller("/transactions", transactionRoute)
class TransactionController {
	//  edit transaction
	//  delete transaction
	//  get transaction

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
				members: req.session.userId
			});
			if (budget) {
				// create new transaction and add to budget
				const transaction: ITransaction = {
					...filterBody,
					user: req.session.userId
				};
				budget.transactions.push(transaction);

				// save updated budget
				await budget.save();

				// Send updated transactions
				res.status(201).json(budget.transactions);
			} else return next(new AppError("Budget not found", 404));
		} else return next(new AppError("User no longer logged in", 403));
	}

	@patch("/update/:transactionId")
	@use(requireAuth)
	@catchAsync
	async updateTransaction(req: Request, res: Response, next: NextFunction) {
		if (req.session) {
			const filterBody: ITransaction = checkBody(
				req.body,
				["desc", "date", "amount", "category"],
				next
			);
			// Find budget and thus transaction by user
			// Update the transaction while keeping the old ones
			const budget = await Budget.findOneAndReplace(
				{
					transactions: { $elemMatch: { _id: req.params.transactionId } },
					members: req.session.userId
				},
				{ transaction: filterBody },
				{
					new: true,
					runValidators: true,
					arrayFilters: [
						{ transactions: { $elemMatch: { _id: req.params.transactionId } } },
						{ $set: { "transactions.$._id": filterBody } }
					]
				}
			);
			if (!budget)
				return next(new AppError("No budget or transaction found.", 404));

			res.status(200).json(budget);
		} else return next(new AppError("User no longer logged in", 403));
	}
}
