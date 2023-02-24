"use strict";
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
var Budget_1 = require("./../models/Budget");
var checkBody_1 = require("../utils/checkBody");
var appError_1 = require("./../utils/appError");
var decorators_1 = require("../decorators");
var requireAuth_1 = require("../middlewares/requireAuth");
var bodyValidator_1 = require("../middlewares/bodyValidator");
exports.budgetRoute = express_1.Router();
var budgetController = /** @class */ (function () {
    function budgetController() {
    }
    budgetController.prototype.newBudget = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, categories, name, startingBalance, budget;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, categories = _a.categories, name = _a.name, startingBalance = _a.startingBalance;
                        if (!req.session) return [3 /*break*/, 2];
                        return [4 /*yield*/, Budget_1.Budget.create({
                                categories: categories,
                                name: name,
                                startingBalance: startingBalance,
                                user: req.session.userId
                            })];
                    case 1:
                        budget = _b.sent();
                        // Send only the new budget to the client
                        // Client will update the store state
                        // Starts with empty transaction
                        res.status(200).json(budget);
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, next(new appError_1.AppError("User no longer logged in", 403))];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // For updating categories,name, startingBalance of budget
    budgetController.prototype.updateBudget = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var filterBody, budget_1, budgetsList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!req.session) return [3 /*break*/, 5];
                        filterBody = checkBody_1.checkBody(req.body, ["name", "categories", "startingBalance"], next);
                        return [4 /*yield*/, Budget_1.Budget.findOneAndUpdate({
                                _id: req.params.id,
                                user: req.session.userId
                            }, filterBody, {
                                new: true,
                                runValidators: true
                            })];
                    case 1:
                        budget_1 = _a.sent();
                        if (!budget_1)
                            return [2 /*return*/, next(new appError_1.AppError("No budget found.", 404))];
                        // Update each transactions category if it was changed!
                        // Or prevent user from deleting categories!
                        if (req.body.categories.length < budget_1.categories.length) {
                            return [2 /*return*/, next(new appError_1.AppError("Budget categories cannot be deleted!", 400))];
                        }
                        if (!req.body.startingBalance) return [3 /*break*/, 3];
                        budget_1.balance = budget_1.startingBalance;
                        budget_1.transactions.forEach(function (t) {
                            t.balance = budget_1.balance + t.amount;
                            budget_1.balance += t.amount;
                        });
                        // Save updated budget
                        return [4 /*yield*/, budget_1.save()];
                    case 2:
                        // Save updated budget
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, Budget_1.Budget.find({
                            user: req.session.userId
                        }).select("-transactions -user -__v")];
                    case 4:
                        budgetsList = _a.sent();
                        res.status(200).json(budgetsList);
                        return [3 /*break*/, 6];
                    case 5: return [2 /*return*/, next(new appError_1.AppError("User no longer logged in", 403))];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    budgetController.prototype.getAllBudget = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var budgetsList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!req.session) return [3 /*break*/, 2];
                        return [4 /*yield*/, Budget_1.Budget.find({
                                user: req.session.userId
                            }).select("-transactions -user -__v")];
                    case 1:
                        budgetsList = _a.sent();
                        if (!budgetsList || budgetsList.length === 0)
                            return [2 /*return*/, next(new appError_1.AppError("User does not have any budgets connected", 404))];
                        res.status(200).json(budgetsList);
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, next(new appError_1.AppError("User no longer logged in", 403))];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Transaction will be a separate request
    budgetController.prototype.getBudget = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var budget;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!req.session) return [3 /*break*/, 2];
                        return [4 /*yield*/, Budget_1.Budget.findOne({
                                _id: req.params.id,
                                user: req.session.userId
                            }).select("-transactions -user -__v")];
                    case 1:
                        budget = _a.sent();
                        if (!budget)
                            return [2 /*return*/, next(new appError_1.AppError("No budget belongs to the id", 404))];
                        res.status(200).json(budget);
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, next(new appError_1.AppError("User no longer logged in", 403))];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    budgetController.prototype.deleteBudget = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var budget;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!req.session) return [3 /*break*/, 2];
                        return [4 /*yield*/, Budget_1.Budget.findOneAndRemove({
                                _id: req.params.id,
                                user: req.session.userId
                            })];
                    case 1:
                        budget = _a.sent();
                        if (!budget)
                            return [2 /*return*/, next(new appError_1.AppError("No budget belongs to the id", 404))];
                        res.status(204).json({ success: "Budget Deleted" });
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, next(new appError_1.AppError("User no longer logged in", 403))];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // get method
    // group by categoryindex
    // display income and expenses
    // Need annual category data
    budgetController.prototype.getAnnualCategoryData = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Budget_1.Budget.aggregate([
                            {
                                $match: {
                                    _id: mongoose_1.Types.ObjectId(req.params.budgetId)
                                }
                            },
                            {
                                $unwind: "$transactions"
                            },
                            {
                                $sort: {
                                    "transactions.date": -1
                                }
                            },
                            {
                                $project: {
                                    transactions: 1,
                                    year: {
                                        $year: "$transactions.date"
                                    },
                                    income: {
                                        $cond: {
                                            if: {
                                                $gte: ["$transactions.amount", 0]
                                            },
                                            then: "$transactions.amount",
                                            else: 0
                                        }
                                    },
                                    expense: {
                                        $cond: {
                                            if: {
                                                $lt: ["$transactions.amount", 0]
                                            },
                                            then: "$transactions.amount",
                                            else: 0
                                        }
                                    }
                                }
                            },
                            {
                                $match: {
                                    year: parseInt(req.params.year, 10)
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        category: "$transactions.categoryIndex"
                                    },
                                    income: {
                                        $sum: "$income"
                                    },
                                    expense: {
                                        $sum: "$expense"
                                    }
                                }
                            },
                            {
                                $sort: {
                                    "_id.category": 1
                                }
                            }
                        ])];
                    case 1:
                        data = _a.sent();
                        res.status(200).json(data);
                        return [2 /*return*/];
                }
            });
        });
    };
    budgetController.prototype.getCategories = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var budget;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Budget_1.Budget.aggregate([
                            {
                                $match: {
                                    _id: mongoose_1.Types.ObjectId(req.params.budgetId)
                                }
                            },
                            {
                                $unwind: "$transactions"
                            },
                            {
                                $sort: {
                                    "transactions.date": -1
                                }
                            },
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
                                            if: {
                                                $gte: ["$transactions.amount", 0]
                                            },
                                            then: "$transactions.amount",
                                            else: 0
                                        }
                                    },
                                    expense: {
                                        $cond: {
                                            if: {
                                                $lt: ["$transactions.amount", 0]
                                            },
                                            then: "$transactions.amount",
                                            else: 0
                                        }
                                    }
                                }
                            },
                            {
                                $match: {
                                    month: parseInt(req.params.month, 10),
                                    year: parseInt(req.params.year, 10)
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        month: "$month",
                                        year: "$year",
                                        category: "$transactions.categoryIndex"
                                    },
                                    income: {
                                        $sum: "$income"
                                    },
                                    expense: {
                                        $sum: "$expense"
                                    }
                                }
                            },
                            {
                                $sort: {
                                    "_id.category": 1
                                }
                            }
                        ])];
                    case 1:
                        budget = _a.sent();
                        res.status(200).json(budget);
                        return [2 /*return*/];
                }
            });
        });
    };
    budgetController.prototype.getStats = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var stats;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Budget_1.Budget.aggregate([
                            {
                                $match: {
                                    _id: mongoose_1.Types.ObjectId(req.params.budgetId)
                                }
                            },
                            {
                                $unwind: "$transactions"
                            },
                            {
                                $sort: {
                                    "transactions.date": -1
                                }
                            },
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
                                            if: {
                                                $gte: ["$transactions.amount", 0]
                                            },
                                            then: "$transactions.amount",
                                            else: 0
                                        }
                                    },
                                    expense: {
                                        $cond: {
                                            if: {
                                                $lt: ["$transactions.amount", 0]
                                            },
                                            then: "$transactions.amount",
                                            else: 0
                                        }
                                    }
                                }
                            },
                            {
                                $match: {
                                    year: parseInt(req.params.year, 10)
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
                                        $first: "$transactions.balance"
                                    }
                                }
                            },
                            {
                                $sort: {
                                    "_id.year": -1,
                                    "_id.month": -1
                                }
                            }
                        ])];
                    case 1:
                        stats = _a.sent();
                        res.status(200).json(stats);
                        return [2 /*return*/];
                }
            });
        });
    };
    budgetController.prototype.getDates = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var dates;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Budget_1.Budget.aggregate([
                            {
                                $match: {
                                    _id: mongoose_1.Types.ObjectId(req.params.budgetId)
                                }
                            },
                            {
                                $unwind: "$transactions"
                            },
                            {
                                $sort: {
                                    "transactions.date": -1
                                }
                            },
                            {
                                $project: {
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
                                        year: "$year"
                                    },
                                    months: {
                                        $addToSet: "$month"
                                    }
                                }
                            },
                            {
                                $unwind: "$months"
                            },
                            {
                                $sort: {
                                    "_id.year": -1,
                                    months: -1
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        year: "$_id.year"
                                    },
                                    months: {
                                        $push: "$months"
                                    }
                                }
                            },
                            {
                                $sort: {
                                    "_id.year": -1
                                }
                            }
                        ])];
                    case 1:
                        dates = _a.sent();
                        res.status(200).json(dates);
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        decorators_1.post("/new"),
        decorators_1.use(requireAuth_1.requireAuth, bodyValidator_1.bodyValidator("name", "categories", "startingBalance")),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], budgetController.prototype, "newBudget", null);
    __decorate([
        decorators_1.patch("/update/:id"),
        decorators_1.use(requireAuth_1.requireAuth),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], budgetController.prototype, "updateBudget", null);
    __decorate([
        decorators_1.get("/all"),
        decorators_1.use(requireAuth_1.requireAuth),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], budgetController.prototype, "getAllBudget", null);
    __decorate([
        decorators_1.get("/:id"),
        decorators_1.use(requireAuth_1.requireAuth),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], budgetController.prototype, "getBudget", null);
    __decorate([
        decorators_1.del("/del/:id"),
        decorators_1.use(requireAuth_1.requireAuth),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], budgetController.prototype, "deleteBudget", null);
    __decorate([
        decorators_1.get("/categories/:budgetId/year/:year"),
        decorators_1.use(requireAuth_1.requireAuth),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], budgetController.prototype, "getAnnualCategoryData", null);
    __decorate([
        decorators_1.get("/categories/:budgetId/month/:month/year/:year"),
        decorators_1.use(requireAuth_1.requireAuth),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], budgetController.prototype, "getCategories", null);
    __decorate([
        decorators_1.get("/stats/:budgetId/year/:year"),
        decorators_1.use(requireAuth_1.requireAuth),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], budgetController.prototype, "getStats", null);
    __decorate([
        decorators_1.get("/dates/:budgetId"),
        decorators_1.use(requireAuth_1.requireAuth),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], budgetController.prototype, "getDates", null);
    budgetController = __decorate([
        decorators_1.controller("/budget", exports.budgetRoute)
    ], budgetController);
    return budgetController;
}());
