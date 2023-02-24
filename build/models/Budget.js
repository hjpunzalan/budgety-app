"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var appError_1 = require("./../utils/appError");
var budgetSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.SchemaTypes.ObjectId,
        ref: "Users",
    },
});
// Validates categories
// Does not work with find update!!!
budgetSchema.pre("save", function (next) {
    var _this = this;
    this.transactions.forEach(function (t) {
        var validate = _this.categories.length > t.categoryIndex;
        if (!validate)
            return next(new appError_1.AppError("Invalid category", 400));
    });
    if (this.isNew)
        this.balance = this.startingBalance;
    next();
});
exports.Budget = mongoose_1.default.model("Budget", budgetSchema);
