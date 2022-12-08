import mongoose from "mongoose";
import { IBudget } from "./../interfaces/Budget";
import { AppError } from "./../utils/appError";

const budgetSchema = new mongoose.Schema({
	name: { type: String, required: true },
	categories: [{ type: String }],
	startingBalance: { type: Number, required: true },
	balance: Number,
	transactions: [
		{
			desc: String,
			date: {
				type: Date,
				default: Date.now,
			},
			categoryIndex: {
				type: Number,
				default: 0,
			},
			amount: Number,
			balance: Number,
		},
	],
	user: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "Users",
	},
});

// Validates categories
// Does not work with find update!!!
budgetSchema.pre<IBudget>("save", function (next) {
	this.transactions.forEach((t) => {
		const validate = this.categories.length > t.categoryIndex;
		if (!validate) return next(new AppError("Invalid category", 400));
	});
	if (this.isNew) this.balance = this.startingBalance;
	next();
});

export const Budget = mongoose.model<IBudget>("Budget", budgetSchema);
