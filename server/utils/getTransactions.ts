import { Budget } from "./../models/Budget";
import { Request } from "express";
import { Types } from "mongoose";

export const getTransactions = (req: Request) => {
	interface Query {
		page: string;
		limit: string;
	}

	let { page, limit }: Query = req.query;

	// Define pagination
	const limitPerPage = parseInt(limit, 10);
	const skip = (parseInt(page, 10) - 1) * limitPerPage;

	// Only shows transactions of the budget
	// If there's no query return dummy projections
	return Budget.aggregate([
		{
			$match: {
				_id: Types.ObjectId(req.params.budgetId)
			}
		},
		{
			$unwind: "$transactions"
		},
		{
			$sort: { "transactions.date": -1 }
		},
		{
			$skip: page ? skip : 0
		},
		{ $limit: limit ? limitPerPage : Number.MAX_SAFE_INTEGER },
		{
			$project: {
				transactions: 1,
				month: {
					$month: "$transactions.date"
				},
				year: {
					$year: "$transactions.date"
				},
				income: {
					$cond: {
						if: { $gte: ["$transactions.amount", 0] },
						then: "$transactions.amount",
						else: 0
					}
				},
				expense: {
					$cond: {
						if: { $lt: ["$transactions.amount", 0] },
						then: "$transactions.amount",
						else: 0
					}
				}
			}
		},
		{
			$group: {
				_id: {
					month: "$month",
					year: "$year"
				},
				income: {
					$sum: "$income"
				},
				expense: {
					$sum: "$expense"
				},
				balance: {
					$sum: "$transactions.amount"
				},
				transactions: {
					$push: "$transactions"
				}
			}
		},

		{
			$sort: {
				"_id.year": -1,
				"_id.month": -1
			}
		}
	]);
};
