"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var express_1 = require("express");
var checkBody_1 = require("./../utils/checkBody");
var appError_1 = require("./../utils/appError");
var Budget_1 = require("./../models/Budget");
var decorators_1 = require("../decorators");
var requireAuth_1 = require("../middlewares/requireAuth");
var bodyValidator_1 = require("../middlewares/bodyValidator");
var getTransactions_1 = require("./../utils/getTransactions");
exports.transactionRoute = express_1.Router();
var TransactionController = /** @class */ (function () {
    function TransactionController() {
    }
    TransactionController.prototype.newTransaction = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var filterBody, budget_1, transaction, i, ms, transactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filterBody = checkBody_1.checkBody(req.body, ["desc", "amount", "categoryIndex", "date"], next);
                        if (!req.session) return [3 /*break*/, 6];
                        return [4 /*yield*/, Budget_1.Budget.findOne({
                                _id: req.params.budgetId,
                                user: req.session.userId
                            })];
                    case 1:
                        budget_1 = _a.sent();
                        if (!budget_1) return [3 /*break*/, 4];
                        transaction = __assign(__assign({}, filterBody), { user: req.session.userId });
                        // Transaction date comes as a string
                        // Add transaction to the budget
                        budget_1.transactions.push(transaction);
                        i = budget_1.transactions.length - 1;
                        ms = budget_1.transactions[i].date.getMilliseconds();
                        budget_1.transactions[i].date.setMilliseconds(ms + (ms === 0 ? budget_1.transactions.length : 10));
                        // Update balance of budget and in transaction
                        // The transactions has to be sorted by date first! Otherwise incorrect running balance will be calculated
                        // Recalculate balance
                        budget_1.balance += transaction.amount;
                        budget_1.transactions.sort(function (a, b) {
                            if (a.date > b.date)
                                return 1;
                            // a , b (2nd Dec , 1st Dec)
                            else
                                return -1; // b, a
                        });
                        // Recalculate balance of budget and transactions
                        budget_1.balance = budget_1.startingBalance;
                        budget_1.transactions.forEach(function (t) {
                            t.balance = budget_1.balance + t.amount;
                            budget_1.balance += t.amount;
                        });
                        // save updated budget
                        return [4 /*yield*/, budget_1.save()];
                    case 2:
                        // save updated budget
                        _a.sent();
                        return [4 /*yield*/, getTransactions_1.getTransactions(req)];
                    case 3:
                        transactions = _a.sent();
                        res.status(201).json(transactions);
                        return [3 /*break*/, 5];
                    case 4: return [2 /*return*/, next(new appError_1.AppError("Budget not found", 404))];
                    case 5: return [3 /*break*/, 7];
                    case 6: return [2 /*return*/, next(new appError_1.AppError("User no longer logged in", 403))];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    TransactionController.prototype.updateTransaction = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var aggregateBudgets, findBudget, transaction, validCategory, ms, budget_2, transactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!req.session) return [3 /*break*/, 7];
                        return [4 /*yield*/, Budget_1.Budget.aggregate([
                                {
                                    $match: {
                                        _id: mongoose_1.Types.ObjectId(req.params.budgetId)
                                    }
                                },
                                {
                                    $project: {
                                        categories: 1,
                                        transactions: 1,
                                        count: { $size: "$transactions" }
                                    }
                                },
                                {
                                    $unwind: "$transactions"
                                },
                                {
                                    $match: {
                                        "transactions._id": mongoose_1.Types.ObjectId(req.params.transactionId)
                                    }
                                }
                            ])];
                    case 1:
                        aggregateBudgets = _a.sent();
                        findBudget = aggregateBudgets[0];
                        transaction = findBudget.transactions;
                        // forEach key values does not work because string type keys cannot be indexed to redefine object
                        // This method does not require a filter checkBody
                        if (req.body.desc)
                            transaction.desc = req.body.desc;
                        if (req.body.date)
                            transaction.date = new Date(req.body.date);
                        if (req.body.amount)
                            transaction.amount = req.body.amount;
                        if (req.body.categoryIndex)
                            transaction.categoryIndex = req.body.categoryIndex;
                        validCategory = findBudget.categories.length > transaction.categoryIndex;
                        if (!validCategory)
                            return [2 /*return*/, next(new appError_1.AppError("Invalid category", 400))];
                        ms = transaction.date.getMilliseconds();
                        transaction.date.setMilliseconds(ms + (ms === 0 ? findBudget.count : 10));
                        return [4 /*yield*/, Budget_1.Budget.findOneAndUpdate({
                                _id: req.params.budgetId,
                                user: req.session.userId,
                                "transactions._id": req.params.transactionId
                            }, {
                                $set: {
                                    "transactions.$": transaction
                                }
                            }, {
                                new: true,
                                runValidators: true
                            })];
                    case 2:
                        budget_2 = _a.sent();
                        if (!budget_2) return [3 /*break*/, 5];
                        // May need to update all the balance of each transaction
                        // Count each balance again
                        // Sort transactions first by date (oldest to newest!)
                        budget_2.transactions.sort(function (a, b) {
                            if (a.date > b.date)
                                return 1;
                            // a , b (2nd Dec , 1st Dec)
                            else
                                return -1; // b, a
                        });
                        // Recalculate balance of budget and transactions
                        budget_2.balance = budget_2.startingBalance;
                        budget_2.transactions.forEach(function (t) {
                            t.balance = budget_2.balance + t.amount;
                            budget_2.balance += t.amount;
                        });
                        return [4 /*yield*/, budget_2.save()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, getTransactions_1.getTransactions(req)];
                    case 4:
                        transactions = _a.sent();
                        res.status(200).json(transactions);
                        return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, next(new appError_1.AppError("Budget or transaction not found", 404))];
                    case 6: return [3 /*break*/, 8];
                    case 7: return [2 /*return*/, next(new appError_1.AppError("User no longer logged in", 403))];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    TransactionController.prototype.getAllTransactions = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var transactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getTransactions_1.getTransactions(req)];
                    case 1:
                        transactions = _a.sent();
                        res.status(200).json(transactions);
                        return [2 /*return*/];
                }
            });
        });
    };
    TransactionController.prototype.deleteTransaction = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var budget_3, transactions;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!req.session) return [3 /*break*/, 6];
                        return [4 /*yield*/, Budget_1.Budget.findOneAndUpdate({
                                _id: req.params.budgetId,
                                user: req.session.userId,
                                "transactions._id": req.params.transactionId
                            }, {
                                $pull: {
                                    transactions: { _id: req.params.transactionId }
                                }
                            }, {
                                new: true,
                                runValidators: true
                            })];
                    case 1:
                        budget_3 = _a.sent();
                        if (!budget_3) return [3 /*break*/, 4];
                        // Recalculate balance
                        budget_3.transactions.sort(function (a, b) {
                            if (a.date > b.date)
                                return 1;
                            // a , b (2nd Dec , 1st Dec)
                            else
                                return -1; // b, a
                        });
                        // Recalculate balance of budget and transactions
                        budget_3.balance = budget_3.startingBalance;
                        budget_3.transactions.forEach(function (t) {
                            t.balance = budget_3.balance + t.amount;
                            budget_3.balance += t.amount;
                        });
                        // save updated budget
                        return [4 /*yield*/, budget_3.save()];
                    case 2:
                        // save updated budget
                        _a.sent();
                        return [4 /*yield*/, getTransactions_1.getTransactions(req)];
                    case 3:
                        transactions = _a.sent();
                        res.status(200).json(transactions);
                        return [3 /*break*/, 5];
                    case 4: return [2 /*return*/, next(new appError_1.AppError("Budget or transaction not found", 404))];
                    case 5: return [3 /*break*/, 7];
                    case 6: return [2 /*return*/, next(new appError_1.AppError("User no longer logged in", 403))];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    // Get transactions by budget id, year, month
    TransactionController.prototype.getTransaction = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var budget, transaction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!req.session) return [3 /*break*/, 2];
                        return [4 /*yield*/, Budget_1.Budget.findOne({
                                _id: req.params.budgetId,
                                user: req.session.userId
                            }, {
                                transactions: {
                                    $elemMatch: { _id: req.params.transactionId }
                                }
                            })];
                    case 1:
                        budget = _a.sent();
                        if (budget) {
                            transaction = budget.transactions[0];
                            res.status(200).json(transaction);
                        }
                        else
                            return [2 /*return*/, next(new appError_1.AppError("Budget or transaction not found", 404))];
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, next(new appError_1.AppError("User no longer logged in", 403))];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        decorators_1.patch("/new/:budgetId")
        // removed categoryIndex because value of 0 is invalid which is also an index defaults to 0 when not provided
        ,
        decorators_1.use(requireAuth_1.requireAuth, bodyValidator_1.bodyValidator("desc", "amount")),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], TransactionController.prototype, "newTransaction", null);
    __decorate([
        decorators_1.patch("/update/:budgetId/:transactionId"),
        decorators_1.use(requireAuth_1.requireAuth),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], TransactionController.prototype, "updateTransaction", null);
    __decorate([
        decorators_1.get("/:budgetId"),
        decorators_1.use(requireAuth_1.requireAuth),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], TransactionController.prototype, "getAllTransactions", null);
    __decorate([
        decorators_1.patch("/delete/:budgetId/:transactionId"),
        decorators_1.use(requireAuth_1.requireAuth),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], TransactionController.prototype, "deleteTransaction", null);
    __decorate([
        decorators_1.get("/:budgetId/:transactionId"),
        decorators_1.use(requireAuth_1.requireAuth),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], TransactionController.prototype, "getTransaction", null);
    TransactionController = __decorate([
        decorators_1.controller("/transactions", exports.transactionRoute)
    ], TransactionController);
    return TransactionController;
}());
