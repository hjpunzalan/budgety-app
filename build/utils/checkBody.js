"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBody = void 0;
var appError_1 = require("./appError");
// Req.body can be anything and thus type is any
var checkBody = function (body, allowedFields, next) {
    // Initialize new object with edited date and then populated with allowed body from req.body
    var newObj = { lastEdited: Date.now() - 1000 };
    Object.keys(body).forEach(function (el) {
        if (allowedFields.includes(el))
            newObj[el] = body[el];
        else
            return next(new appError_1.AppError("Invalid request fields.", 400));
    });
    return newObj;
};
exports.checkBody = checkBody;
