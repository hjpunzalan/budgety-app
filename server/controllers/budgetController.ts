import { checkBody } from "../utils/checkBody";
import { AppError } from "./../utils/appError";
import { Budget } from "./../models/Budget";
import { Request, Response, NextFunction, Router } from "express";
import { controller, post, patch, use, catchAsync } from "../decorators";
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

	// For updating categories, members or name of budget
	@patch("/updatebudget/:id")
	@use(requireAuth)
	@catchAsync
	async updateBudget(req: Request, res: Response, next: NextFunction) {
		if (req.session) {
			const filterBody = checkBody(
				req.body,
				["name", "categories", "members"],
				next
			);

			// Find and check budget exist
			// Update budget
			const budget = await Budget.findByIdAndUpdate(req.params.id, filterBody, {
				new: true,
				runValidators: true
			});
			if (!budget) return next(new AppError("No budget found.", 404));

			if (!budget.checkUser(req.session.userId))
				return next(new AppError("Budget does not belong to user", 403));

			res.status(200).json(budget);
		} else return next(new AppError("User no longer logged in", 403));
	}

	// delete budget
	//  get budget
}
