"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = void 0;
var Budget_1 = require("./../models/Budget");
var mongoose_1 = require("mongoose");
var getTransactions = function (req) {
    var _a = req.query, page = _a.page, limit = _a.limit;
    // Define pagination
    var limitPerPage = parseInt(limit, 10);
    var skip = (parseInt(page, 10) - 1) * limitPerPage;
    // Only shows transactions of the budget
    // If there's no query return dummy projections
    return Budget_1.Budget.aggregate([
        {
            $match: {
                _id: mongoose_1.Types.ObjectId(req.params.budgetId)
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
                }
            }
        },
        {
            $group: {
                _id: {
                    month: "$month",
                    year: "$year"
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
exports.getTransactions = getTransactions;
