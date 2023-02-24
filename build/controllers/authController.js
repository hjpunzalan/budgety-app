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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var crypto_1 = __importDefault(require("crypto"));
var decorators_1 = require("../decorators");
var Users_1 = require("../models/Users");
var appError_1 = require("./../utils/appError");
var bodyValidator_1 = require("../middlewares/bodyValidator");
var requireAuth_1 = require("../middlewares/requireAuth");
var Email_1 = require("../utils/Email");
exports.authRoute = express_1.Router();
// commented out password in user model
var UserController = /** @class */ (function () {
    function UserController() {
    }
    UserController.prototype.checkUser = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!req.session) return [3 /*break*/, 2];
                        return [4 /*yield*/, Users_1.Users.findById(req.session.userId)];
                    case 1:
                        user = _a.sent();
                        res.status(200).json(user);
                        _a.label = 2;
                    case 2:
                        next();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.isLoggedIn = function (req, res) {
        if ((req.session && !req.session.loggedIn) || !req.session) {
            res.status(200).json(false);
        }
        else {
            res.status(200).json(true);
        }
    };
    UserController.prototype.login = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, password, user, activateUser, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = req.body, email = _a.email, password = _a.password;
                        return [4 /*yield*/, Users_1.Users.findOne({ email: email }).select("+password")];
                    case 1:
                        user = _d.sent();
                        if (!!user) return [3 /*break*/, 4];
                        return [4 /*yield*/, Users_1.Users.updateOne({ email: email }, { active: true })];
                    case 2:
                        activateUser = _d.sent();
                        if (!activateUser.n) return [3 /*break*/, 4];
                        return [4 /*yield*/, Users_1.Users.findOne({
                                email: email
                            }).select("+password")];
                    case 3:
                        user = _d.sent();
                        _d.label = 4;
                    case 4:
                        _b = !user;
                        if (_b) return [3 /*break*/, 7];
                        _c = user.password;
                        if (!_c) return [3 /*break*/, 6];
                        return [4 /*yield*/, user.checkPassword(password, user.password)];
                    case 5:
                        _c = !(_d.sent());
                        _d.label = 6;
                    case 6:
                        _b = (_c);
                        _d.label = 7;
                    case 7:
                        // Verify user exist and password is correct
                        if (_b)
                            return [2 /*return*/, next(new appError_1.AppError("Invalid email or password. Please try again.", 401))];
                        // remove users password from response
                        user.password = undefined;
                        // Add to session
                        // any type need to fix
                        if (req.session) {
                            req.session.loggedIn = true;
                            req.session.userId = user.id;
                            req.session.date = Date.now();
                        }
                        res.status(200).json(user);
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.logout = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (req.session)
                    req.session.destroy(function (err) {
                        if (err)
                            return next(err);
                        res.clearCookie("sid");
                        res.status(200).send("User logged out");
                    });
                return [2 /*return*/];
            });
        });
    };
    UserController.prototype.forgotPassword = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, email, url, user, resetToken, resetURL, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, email = _a.email, url = _a.url;
                        return [4 /*yield*/, Users_1.Users.findOne({
                                email: email
                            })];
                    case 1:
                        user = _b.sent();
                        if (!user) {
                            return [2 /*return*/, next(new appError_1.AppError("There is no user with this email address", 404))];
                        }
                        resetToken = user.createPasswordResetToken();
                        //   Password reset token added to user document and should be saved
                        return [4 /*yield*/, user.save({
                                validateBeforeSave: false
                            })];
                    case 2:
                        //   Password reset token added to user document and should be saved
                        _b.sent(); // modified the user document ... disabled validators before save
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 7]);
                        resetURL = url + "/reset/" + resetToken;
                        return [4 /*yield*/, new Email_1.Email(user).sendPasswordReset(resetToken, resetURL)];
                    case 4:
                        _b.sent();
                        res.status(200).json({
                            status: "success",
                            message: "Token sent to email!"
                        });
                        return [3 /*break*/, 7];
                    case 5:
                        error_1 = _b.sent();
                        user.passwordResetToken = undefined;
                        user.passwordResetExpires = undefined;
                        return [4 /*yield*/, user.save({
                                validateBeforeSave: false
                            })];
                    case 6:
                        _b.sent(); // dont need to revalidate
                        console.error(error_1);
                        return [2 /*return*/, next(new appError_1.AppError("There was an error sending the email. Try again later", 500))];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.resetPassword = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, newPassword, confirmPassword, hashedToken, user;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, newPassword = _a.newPassword, confirmPassword = _a.confirmPassword;
                        // Check if newPassword is same as confirmPassword
                        if (newPassword != confirmPassword)
                            return [2 /*return*/, next(new appError_1.AppError("Please confirm password correctly.", 400))];
                        hashedToken = crypto_1.default
                            .createHash("sha256")
                            .update(req.params.token)
                            .digest("hex");
                        return [4 /*yield*/, Users_1.Users.findOne({
                                passwordResetToken: hashedToken,
                                passwordResetExpires: {
                                    $gt: Date.now()
                                } // mongoDB can convert different format into the same to compare eg. miliseconds
                            })];
                    case 1:
                        user = _b.sent();
                        // 2) If token has not expired, and there is user, set the new password
                        // Check if user is found
                        if (!user) {
                            return [2 /*return*/, next(new appError_1.AppError("Token is invalid or has expired", 400))];
                        }
                        // modify data
                        user.password = newPassword;
                        user.passwordResetToken = undefined;
                        user.passwordResetExpires = undefined;
                        return [4 /*yield*/, user.save()];
                    case 2:
                        _b.sent(); // use save to run validators again because find and update wont
                        // 3) Update changePasswordAt property of the user
                        // DONE in pre middleware of User schema
                        // 4) Log the user in using session
                        if (req.session) {
                            req.session.loggedIn = true;
                            req.session.userId = user.id;
                        }
                        res.status(200).json(user);
                        return [2 /*return*/];
                }
            });
        });
    };
    UserController.prototype.changePassword = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, currentPassword, newPassword, confirmPassword, user, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = req.body, currentPassword = _a.currentPassword, newPassword = _a.newPassword, confirmPassword = _a.confirmPassword;
                        // Check if newPassword is same as confirmPassword
                        if (newPassword != confirmPassword)
                            return [2 /*return*/, next(new appError_1.AppError("Please confirm password correctly.", 400))];
                        if (!req.session) return [3 /*break*/, 7];
                        return [4 /*yield*/, Users_1.Users.findById(req.session.userId).select("+password")];
                    case 1:
                        user = _c.sent();
                        _b = user &&
                            user.password;
                        if (!_b) return [3 /*break*/, 3];
                        return [4 /*yield*/, user.checkPassword(currentPassword, user.password)];
                    case 2:
                        _b = !(_c.sent());
                        _c.label = 3;
                    case 3:
                        if (!_b) return [3 /*break*/, 4];
                        return [2 /*return*/, next(new appError_1.AppError("Please enter the correct current password.", 401))];
                    case 4:
                        if (!user) return [3 /*break*/, 6];
                        // 3) If so, update password
                        user.password = newPassword;
                        // validators in Schema happen after saving into Document
                        // User.findByIdAndUpdate will not work as intended!
                        return [4 /*yield*/, user.save()];
                    case 5:
                        // validators in Schema happen after saving into Document
                        // User.findByIdAndUpdate will not work as intended!
                        _c.sent();
                        user.password = undefined;
                        // 4) Password changed at and password needs to be modified
                        //   Added middlewares that updates passwordChanged and password
                        //   requireAuth  takes into account changedPasswordAfter ( changed password while logged in)
                        // Set new date for the user changing the password to be still logged in but windows will be logged out
                        req.session.date = Date.now();
                        res.status(200).json(user);
                        _c.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        next(new appError_1.AppError(" No session found. User may not be logged in!", 403));
                        _c.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        decorators_1.get("/checkuser"),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "checkUser", null);
    __decorate([
        decorators_1.get("/isloggedin"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], UserController.prototype, "isLoggedIn", null);
    __decorate([
        decorators_1.post("/login"),
        decorators_1.use(bodyValidator_1.bodyValidator("email", "password")),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "login", null);
    __decorate([
        decorators_1.get("/logout"),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "logout", null);
    __decorate([
        decorators_1.post("/forgotpassword"),
        decorators_1.use(bodyValidator_1.bodyValidator("email", "url")),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "forgotPassword", null);
    __decorate([
        decorators_1.patch("/resetpassword/:token"),
        decorators_1.use(bodyValidator_1.bodyValidator("newPassword", "confirmPassword")),
        decorators_1.catchAsync,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "resetPassword", null);
    __decorate([
        decorators_1.post("/changepassword"),
        decorators_1.use(requireAuth_1.requireAuth, bodyValidator_1.bodyValidator("currentPassword", "newPassword", "confirmPassword")),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object, Function]),
        __metadata("design:returntype", Promise)
    ], UserController.prototype, "changePassword", null);
    UserController = __decorate([
        decorators_1.controller("/auth", exports.authRoute)
    ], UserController);
    return UserController;
}());
