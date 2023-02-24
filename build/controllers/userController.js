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
var appError_1 = require("./../utils/appError");
var express_1 = require("express");
var decorators_1 = require("../decorators");
var Users_1 = require("../models/Users");
var bodyValidator_1 = require("../middlewares/bodyValidator");
var queryHandling_1 = require("./../utils/queryHandling");
var requireAuth_1 = require("../middlewares/requireAuth");
var checkBody_1 = require("../utils/checkBody");
exports.userRoute = express_1.Router();
// commented out password in user model
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.prototype.registerUser = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, firstName, lastName, email, password, newUser;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, firstName = _a.firstName, lastName = _a.lastName, email = _a.email, password = _a.password;
                        return [4 /*yield*/, Users_1.Users.create({
                                firstName: firstName,
                                lastName: lastName,
                                email: email,
                                password: password
                            })];
                    case 1:
                        newUser = _b.sent();
                        // remove password from json output;
                        newUser.password = undefined;
                        // Add user to session
                        if (req.session) {
                            req.session.loggedIn = true;
                            req.session.userId = newUser.id;
                            req.session.date = Date.now();
                        }
                        // need to send an email with default password of user
                        // password must only be seen by the user and not the admin that registered user
                        res.status(201).json(newUser);
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.getAllUsers = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var query, features, users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = Users_1.Users.find();
                        features = new queryHandling_1.QueryHandling(query, req.query).sort().filter();
                        return [4 /*yield*/, features.query];
                    case 1:
                        users = _a.sent();
                        res.status(200).json(users);
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.updateMe = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var filterBody, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        filterBody = checkBody_1.checkBody(req.body, ["firstName", "lastName", "email", "photo"], next);
                        if (!req.session) return [3 /*break*/, 2];
                        return [4 /*yield*/, Users_1.Users.findByIdAndUpdate(req.session.userId, filterBody, {
                                new: true,
                                runValidators: true
                            })];
                    case 1:
                        user = _a.sent();
                        res.status(200).json(user);
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, next(new appError_1.AppError("No session token found", 402))];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.deleteMe = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!req.session) return [3 /*break*/, 2];
                        return [4 /*yield*/, Users_1.Users.findByIdAndUpdate(req.session.userId, {
                                active: false
                            })];
                    case 1:
                        user = _a.sent();
                        return [2 /*return*/, res.status(204).json(user)];
                    case 2:
                        next(new appError_1.AppError("User not logged in", 403));
                        return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        decorators_1.post("/register"),
        decorators_1.use(bodyValidator_1.bodyValidator("firstName", "lastName", "email", "password")),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "registerUser", null);
    __decorate([
        decorators_1.get("/"),
        decorators_1.use(requireAuth_1.requireAuth),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "getAllUsers", null);
    __decorate([
        decorators_1.patch("/updateme"),
        decorators_1.use(requireAuth_1.requireAuth),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "updateMe", null);
    __decorate([
        decorators_1.del("/deleteme"),
        decorators_1.use(requireAuth_1.requireAuth),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "deleteMe", null);
    UserController = __decorate([
        decorators_1.controller("/users", exports.userRoute)
    ], UserController);
    return UserController;
}());
