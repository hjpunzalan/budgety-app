import { patch } from "./../decorators/routes";
import { AppError } from "./../utils/appError";
import { Budget } from "./../models/Budget";
import { Request, Response, NextFunction, Router } from "express";
import { controller, post, use, catchAsync } from "../decorators";
import { requireAuth } from "../middlewares/requireAuth";
import { bodyValidator } from "../middlewares/bodyValidator";

export const budgetRoute = Router();

@controller("/budget", budgetRoute)
class budgetController {
	@post("/newbudget")
	@use(requireAuth, bodyValidator("name", "categories", "members"))
	@catchAsync
	async newBudget(req: Request, res: Response, next: NextFunction) {
		interface ReqBody {
			name: string;
			categories: string[];
			members: string[];
		}
		// User will be prompted for any other extra members that will have access to the budget

		const { members }: ReqBody = req.body;

		// Members will be added after they accepted invite from email
		// Member will have to declare categories beforehand or update budget

		if (req.session) {
			members.unshift(req.session.userId);
			const budget = await Budget.create(req.body);
			res.status(200).json(budget);
		} else return next(new AppError("User no longer logged in", 403));
	}

	@patch("/newtransaction")
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
