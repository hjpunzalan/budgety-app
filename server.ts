import dotenv from "dotenv";
// Must be your own private process variables
//////////////
if (process.env.NODE_ENV === 'production') {
	dotenv.config({ path: './production.env' });
} else {
	dotenv.config({ path: './config.env' });
}

import mongoose from "mongoose";
import { app } from "./app";

// SYNC Unhandled rejections
// listening to event uncaughtException
process.on("uncaughtException", (err: Error) => {
	console.log(process.env.NODE_ENV)
	console.log("UNCAUGHT Exception! Shutting down...");
	console.log(err.name, err.message);
	process.exit(1); // 0 success , 1 for unhandled rejection
});

// Connecting to mongoDB using mongoose
mongoose
	.connect(process.env.DATABASE as string  + "?directConnection=true", {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})
	.then(() => console.log("DB connection is successful!"));

// Development / Production mode
console.log(`Server running on: ${process.env.NODE_ENV} mode`);

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
	console.log(`App running on port ${port}`);
});

// ASYNC Promises
// process object will emmit unhandled rejection
// promise rejection to have last safety nets

process.on(
	"unhandledRejection",
	(reason: Error | unknown | any, promise: Promise<any>): void => {
		console.log("UNHANDLED REJECTION! Shutting down...");
		if (reason instanceof Error)
			console.log(`AT ${promise}`, reason.name, reason.message);
		server.close(() => {
			//  BY having server.close finishes all request that is being handled then closes the app
			process.exit(1); // 0 success , 1 for unhandled rejection
		});
	}
);

// Need a tool that restarts application
