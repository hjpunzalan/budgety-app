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
	@use(requireAuth, bodyValidator("name", "members"))
	@catchAsync
	async newBudget(req: Request, res: Response, next: NextFunction) {
		interface ReqBody {
			name: string;
			members: string[];
		}
		// User will be prompted for any other extra members that will have access to the budget

		const { name, members }: ReqBody = req.body;
		if (req.session) {
			members.unshift(req.session.userId);
			const budget = await Budget.create({ name, members });
			res.status(200).json(budget);
		} else return next(new AppError("User no longer logged in", 403));
	}
}
