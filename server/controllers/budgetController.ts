import { Request, Response, NextFunction, Router } from "express";
import { Users } from "./../models/Users";
import { Budget } from "./../models/Budget";
import { IUser } from "./../interfaces/User";
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
	@use(requireAuth, bodyValidator("name", "categories"))
	@catchAsync
	async newBudget(req: Request, res: Response, next: NextFunction) {
		interface ReqBody {
			name: string;
			categories: string[];
		}
		const { categories, name }: ReqBody = req.body;
		// Member will have to declare categories beforehand or update budget

		if (req.session) {
			const budget = await Budget.create({
				categories,
				name,
				user: req.session.userId
			});
			const user = await Users.findById(req.session.userId);

			// Add budget in user's document
			if (user) {
				user.budgets.push({
					budgetId: budget._id,
					name: budget.name
				});
				await user.save();
			} else return next(new AppError("User not found!", 404));
			// Send response to client
			res.status(200).json(budget);
		} else return next(new AppError("User no longer logged in", 403));
	}

	// For updating categories, user or name of budget
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
				["name", "categories"],
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

			res.status(200).json(budget);
		} else return next(new AppError("User no longer logged in", 403));
	}

	@get("/all")
	@use(requireAuth)
	@catchAsync
	async getAllBudget(req: Request, res: Response, next: NextFunction) {
		// Get all budget for user
		if (req.session) {
			const budgets = await Budget.find({ user: req.session.userId });
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
				user: req.session.userId
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
				user: req.session.userId
			});
			if (!budget)
				return next(new AppError("No budget belongs to the id", 404));
			res.status(204).json({ success: "Budget Deleted" });
		} else return next(new AppError("User no longer logged in", 403));
	}
}
