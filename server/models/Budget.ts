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
				ref: "Users",
				autopopulate: true
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
			ref: "Users",
			autopopulate: true
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

// Find budget belonging to members
budgetSchema.methods.checkUser = function(userId: string) {
	return this.members.includes(userId);
};

// populate members
budgetSchema.post<IBudget>("save", function(doc, next) {
	doc
		.populate("members")
		.execPopulate()
		.then(function() {
			next();
		});
});

export const Budget = mongoose.model<IBudget>("Budget", budgetSchema);
