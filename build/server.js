"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
// Must be your own private process variables
//////////////
if (process.env.NODE_ENV === 'production') {
    dotenv_1.default.config({ path: './production.env' });
}
else {
    dotenv_1.default.config({ path: './config.env' });
}
var mongoose_1 = __importDefault(require("mongoose"));
var app_1 = require("./app");
// SYNC Unhandled rejections
// listening to event uncaughtException
process.on("uncaughtException", function (err) {
    console.log(process.env.NODE_ENV);
    console.log("UNCAUGHT Exception! Shutting down...");
    console.log(err.name, err.message);
    process.exit(1); // 0 success , 1 for unhandled rejection
});
// Connecting to mongoDB using mongoose
mongoose_1.default
    .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
    .then(function () { return console.log("DB connection is successful!"); });
// Development / Production mode
console.log("Server running on: " + process.env.NODE_ENV + " mode");
console.log("new version");
var port = process.env.PORT || 8000;
var server = app_1.app.listen(port, function () {
    console.log("App running on port " + port);
});
// ASYNC Promises
// process object will emmit unhandled rejection
// promise rejection to have last safety nets
process.on("unhandledRejection", function (reason, promise) {
    console.log("UNHANDLED REJECTION! Shutting down...");
    if (reason instanceof Error)
        console.log("AT " + promise, reason.name, reason.message);
    server.close(function () {
        //  BY having server.close finishes all request that is being handled then closes the app
        process.exit(1); // 0 success , 1 for unhandled rejection
    });
});
// Need a tool that restarts application
