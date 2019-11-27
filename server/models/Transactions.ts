import mongoose from "mongoose";
import { ITransaction } from "./../interfaces/Transaction";

const transactionSchema = new mongoose.Schema({
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
});
// populate members
transactionSchema.post<ITransaction>("save", function(doc, next) {
	doc
		.populate("members")
		.execPopulate()
		.then(function() {
			next();
		});
});
export const Transaction = mongoose.model<ITransaction>(
	"Budget",
	transactionSchema
);
