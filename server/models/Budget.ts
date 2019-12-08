import { AppError } from "./../utils/appError";
import mongoose from "mongoose";
import { IBudget } from "./../interfaces/Budget";

const budgetSchema = new mongoose.Schema({
	name: { type: String, required: true },
	categories: [{ type: String }],
	transactions: [
		{
			desc: String,
			date: {
				type: Date,
				default: Date.now
			},
			category: {
				type: String
			},
			amount: Number
		}
	],
	user: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "Users"
	}
});

// Validates categories
budgetSchema.pre<IBudget>("save", function(next) {
	this.transactions.forEach(t => {
		const validate = this.categories.includes(t.category);
		if (!validate) return next(new AppError("Invalid category", 400));
	});
	next();
});

export const Budget = mongoose.model<IBudget>("Budget", budgetSchema);
