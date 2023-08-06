"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
var hpp_1 = __importDefault(require("hpp"));
// import morgan from "morgan"; // for dev mode
var express_session_1 = __importDefault(require("express-session"));
var path_1 = __importDefault(require("path"));
var controllers_1 = require("./controllers");
var transactionController_1 = require("./controllers/transactionController");
var appError_1 = require("./utils/appError");
var globalErrorHandler_1 = require("./utils/globalErrorHandler");
exports.app = express_1.default();
//////////////////////// Global Middlewares//////////////////////////
// Add http headers that secure the server
// app.use(helmet());
// Development logging
// if (process.env.NODE_ENV === "development") {
// 	app.use(morgan("dev"));
// }
// Converts incoming json data to js object ---- Body parser that reads data from body into req.body
exports.app.use(express_1.default.json({ limit: "10kb" })); // package will parse 10kb into meaningful data
if (process.env.SESSION_SECRET)
    exports.app.use(express_session_1.default({
        secret: process.env.SESSION_SECRET,
        name: "sid",
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 10 * 1000 * 60,
            sameSite: true,
            secure: false
        }
    }));
else
    exports.app.use(function (req, res, next) {
        next(new appError_1.AppError("missing session secret", 500));
    });
// Data sanitization against NoSQL query injection
//Look at the req and filter out all '$' and '.' that sends queries to db illegaly
exports.app.use(express_mongo_sanitize_1.default());
// Prevent parameter pollution
// prevents adding duplicated parameters in query
// The whitelist works for both req.query and req.body.
exports.app.use(hpp_1.default({
    whitelist: [] // add http parameters used
}));
// Route Handlers
exports.app.use("/api", controllers_1.authRoute, controllers_1.userRoute, controllers_1.budgetRoute, transactionController_1.transactionRoute);
exports.app.use(globalErrorHandler_1.globalErrorHandler);
// Serve static assets in production
if (process.env.NODE_ENV === "production") {
    // set static folder
    exports.app.use(express_1.default.static("client/build"));
    exports.app.get("*", function (req, res) {
        res.sendFile(path_1.default.resolve(__dirname, "..", "client", "build", "index.html"));
    });
}
