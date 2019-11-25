import { IBudget } from "./../interfaces/Budget";
import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
	name: String,
	transactions: [
		{
			desc: String,
			user: {
				type: mongoose.SchemaTypes.ObjectId,
				ref: "Users",
				autopopulate: true
			},
			date: Date.now,
			category: String,
			amount: Boolean
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

export const Budget = mongoose.model<IBudget>("Budget", budgetSchema);
