import { IUser } from "./../interfaces/User";
import { checkBody } from "../utils/checkBody";
import { AppError } from "./../utils/appError";
import { Budget } from "./../models/Budget";
import { Request, Response, NextFunction, Router } from "express";
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
	@patch("/update/:id")
	@use(requireAuth)
	@catchAsync
	async updateBudget(req: Request, res: Response, next: NextFunction) {
		if (req.session) {
			interface ReqBody {
				name: string;
				members: IUser[];
				categories: string;
			}
			const filterBody: ReqBody = checkBody(
				req.body,
				["name", "categories", "members"],
				next
			);

			// Find and check budget exist
			// Make sure its from user logged in
			// Update budget
			const budget = await Budget.findOneAndUpdate(
				{ _id: req.params.id, members: req.session.userId },
				filterBody,
				{
					new: true,
					runValidators: true
				}
			);
			if (!budget) return next(new AppError("No budget found.", 404));

			res.status(200).json(budget);
		} else return next(new AppError("User no longer logged in", 403));
	}

	@get("/all")
	@use(requireAuth)
	@catchAsync
	async getAllBudget(req: Request, res: Response, next: NextFunction) {
		// Get all budget for user
		if (req.session) {
			const budgets = await Budget.find({ members: req.session.userId });
			if (!budgets || budgets.length === 0)
				return next(
					new AppError("User does not have any budgets connected", 404)
				);
			res.status(200).json(budgets);
		} else return next(new AppError("User no longer logged in", 403));
	}

	@get("/:id")
	@use(requireAuth)
	@catchAsync
	async getBudget(req: Request, res: Response, next: NextFunction) {
		if (req.session) {
			const budget = await Budget.findOne({
				_id: req.params.id,
				members: req.session.userId
			});
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
				members: req.session.userId
			});
			if (!budget)
				return next(new AppError("No budget belongs to the id", 404));
			res.status(204).json({ success: "Budget Deleted" });
		} else return next(new AppError("User no longer logged in", 403));
	}
}
