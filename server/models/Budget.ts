import { AppError } from "./../utils/appError";
import mongoose from "mongoose";
import { IBudget } from "./../interfaces/Budget";

const budgetSchema = new mongoose.Schema({
	name: String,
	categories: [{ type: String }],
	transactions: [
		{
			desc: String,
			user: {
				type: mongoose.SchemaTypes.ObjectId,
				ref: "Users"
			},
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
	members: [
		{
			type: mongoose.SchemaTypes.ObjectId,
			ref: "Users"
		}
	]
});

// Validates categories
budgetSchema.pre<IBudget>("save", function(next) {
	this.transactions.forEach(t => {
		const validate = this.categories.includes(t.category);
		if (!validate) return next(new AppError("Invalid category", 400));
	});
	next();
});

// populate members
budgetSchema.post<IBudget>("save", function(doc, next) {
	doc
		.populate("members")
		.populate({
			path: "transactions.user"
		})
		.execPopulate()
		.then(function() {
			next();
		});
});

export const Budget = mongoose.model<IBudget>("Budget", budgetSchema);
