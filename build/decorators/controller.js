"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("./enums");
require("reflect-metadata");
// route prefix refers to the namespace or route the controller belongs
function controller(routePrefix, router) {
    // Target refers to the class object
    return function (target) {
        // Declare all route methods inside class object Controller for specific prefix
        for (var key in target.prototype) {
            // Expect each method in controller class to have methods as route handlers only!
            // method in a class
            var routeHandler = target.prototype[key];
            // Obtain path from routes (get,post etc.)
            // Each route handler would/should have a decorator that defines meta-data, if not ,
            // then nothing happens
            // Get path Meta-data define by routebinder
            var path = Reflect.getMetadata(enums_1.MetadataKeys.Path, target.prototype, key);
            // Added enum to method
            // Get Method Metadata defined by routeBinder
            var method = Reflect.getMetadata(enums_1.MetadataKeys.Method, target.prototype, key);
            // Get middleware meta-data defined by use decorator
            var middlewares = Reflect.getMetadata(enums_1.MetadataKeys.Middleware, target.prototype, key) ||
                [];
            // Apply all handlers to router
            if (path) {
                // Methods (get, post ,put)
                // enum solves the type any problem with method
                router[method].apply(router, __spreadArrays(["" + routePrefix + path], middlewares, [routeHandler]));
            }
        }
    };
}
exports.controller = controller;
