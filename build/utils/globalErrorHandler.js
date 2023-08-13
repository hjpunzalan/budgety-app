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
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
var appError_1 = require("./appError");
// MonogoDB and mongoose use export Error types as Classes
// Invalid ids
var handleCastErrorDB = function (err) {
    var message = "Invalid ".concat(err.path, ": ").concat(err.value, "."); //Invalid _id : wwwwwwww
    return new appError_1.AppError(message, 400);
};
// Duplicate fields
var handleDuplicateFieldsDB = function (err) {
    // regular expressions is always between two slashes '/'
    var value = err.errmsg.match(/(["'])(\\?.)*?\1/); //reg expression between quotation marks
    var message = "Duplicate field value: ".concat(
    //value returns an array
    value[0], ". Please use another value!");
    return new appError_1.AppError(message, 400);
};
// Validation DB errors
var handleValidationErrorDB = function (err) {
    // Object.values converts object property values into an array with the object as argument
    // err.errors return an object of errors with properties where theres validation errors
    var errors = Object.values(err.errors)
        .map(function (el) { return el.message; })
        .join(". ");
    console.log(errors);
    // Join array into a single string
    var message = "Invalid input data. ".concat(errors);
    return new appError_1.AppError(message, 400);
};
// JWT errors
var handleJWTError = function (err) {
    return new appError_1.AppError("Invalid token. Please log in again!", 401);
};
// Custom type guards
function isIAppError(err) {
    return "isOperational" in err; // isOperational errors
}
function isCastError(err) {
    return err.name === "CastError"; // defined by type
}
function isValidationError(err) {
    return err.name === "ValidationError"; // defined by type
}
function isDuplicateError(err) {
    return err.code === 11000; // code for DuplicateFields
}
function isJSONError(err) {
    return err.name === "JsonWebTokenError";
}
var sendErrorProd = function (err, res) {
    // Operational, trusted error: send message to client
    // Production mode: Only send meaningful,concise and easy to understand errors
    if (isIAppError(err)) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
        // Programming or other unknown errors
    }
    else {
        // 1) Log error
        console.error("ERROR", err);
        // 2) Send generic message
        res.status(500).json({
            status: "error",
            message: "Something went very wrong"
        });
    }
};
var sendErrorDev = function (err, res) {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack // stack trace
    });
};
// Error handler passed from controllers
var globalErrorHandler = function (err, req, res, next) {
    // Define additional error properties
    // Union types doesn't let redefining of parameters (err)
    var newError = __assign({}, err);
    if (process.env.NODE_ENV === "development") {
        // destructuring doesnt work with error
        if (isIAppError(err))
            sendErrorDev(err, res);
        else {
            newError = __assign(__assign({}, err), { name: err.name, message: err.message, stack: err.stack, status: "error", statusCode: 500 });
            sendErrorDev(newError, res);
        }
    }
    else if (process.env.NODE_ENV === "production") {
        // Cast Error
        if (isCastError(newError))
            newError = handleCastErrorDB(newError);
        //  Mongo Duplicate Error
        else if (isDuplicateError(newError)) {
            newError = handleDuplicateFieldsDB(newError);
        }
        // Validation Error from mongoose
        else if (isValidationError(newError))
            newError = handleValidationErrorDB(newError);
        // JWT Error
        else if (isJSONError(newError))
            newError = handleJWTError(newError);
        //
        else {
            //  destructuring doesnt work with error as some properties can not be destructured
            // Other errors that wasn't handled but passed as appError
            sendErrorProd(err, res);
            return next();
        }
        // Send newError to client
        sendErrorProd(newError, res);
    }
};
exports.globalErrorHandler = globalErrorHandler;
