import { AppError } from "./../utils/appError";
import { Budget } from "./../models/Budget";
import { Request, Response, NextFunction, Router } from "express";
import { controller, patch, use, catchAsync } from "../decorators";
import { requireAuth } from "../middlewares/requireAuth";
import { bodyValidator } from "../middlewares/bodyValidator";

export const transactionRoute = Router();

@controller("/transaction", transactionRoute)
class TransactionController {
	//  edit transaction
	//  delete transaction
	//  get transaction

	@patch("/new")
	@use(requireAuth, bodyValidator("budget", "desc", "category", "amount"))
	@catchAsync
	async newTransaction(req: Request, res: Response, next: NextFunction) {
		interface ReqBody {
			budget: string;
			desc: string;
			category: string;
			amount: number;
		}
		const { budget, desc, category, amount }: ReqBody = req.body;
		// Find budget
		const budgetGroup = await Budget.findById(budget);
		if (!budgetGroup) return next(new AppError("No budget found.", 404));
		// Set new transaction
		if (req.session) {
			const newTransaction = {
				desc,
				category,
				amount,
				user: req.session.userId
			};
			// Add transaction
			budgetGroup.transactions.push(newTransaction);
			await budgetGroup.save();
			// Display result
			res.status(200).json(budgetGroup);
		} else return next(new AppError("User no longer logged in", 403));
	}
}
