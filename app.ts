import express from "express";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
// import morgan from "morgan"; // for dev mode
import session from "express-session";
import path from "path";
import { AppError } from "./utils/appError";
import { globalErrorHandler } from "./utils/globalErrorHandler";
import { userRoute, authRoute, budgetRoute } from "./controllers";
import { transactionRoute } from "./controllers/transactionController";

export const app = express();

//////////////////////// Global Middlewares//////////////////////////
// Add http headers that secure the server
app.use(helmet());

// Development logging
// if (process.env.NODE_ENV === "development") {
// 	app.use(morgan("dev"));
// }

// Converts incoming json data to js object ---- Body parser that reads data from body into req.body
app.use(express.json({ limit: "10kb" })); // package will parse 10kb into meaningful data

if (process.env.SESSION_SECRET)
	app.use(
		session({
			secret: process.env.SESSION_SECRET,
			name: "sid",
			resave: false, // prevents resave even if not modified
			saveUninitialized: false,
			cookie: {
				maxAge: 10 * 1000 * 60, // remove if we want it as a session
				sameSite: true, // 'strict'
				secure: false
			}
		})
	);
else
	app.use((req, res, next) => {
		next(new AppError("missing session secret", 500));
	});

// Data sanitization against NoSQL query injection
//Look at the req and filter out all '$' and '.' that sends queries to db illegaly
app.use(mongoSanitize());

// Prevent parameter pollution
// prevents adding duplicated parameters in query
// The whitelist works for both req.query and req.body.
app.use(
	hpp({
		whitelist: [] // add http parameters used
	})
);

// Route Handlers
app.use("/api", authRoute, userRoute, budgetRoute, transactionRoute);
app.use(globalErrorHandler);

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
	// set static folder
	app.use(express.static("client/build"));

	app.get("*", (req, res) => {
		res.sendFile(
			path.resolve(__dirname, "..", "client", "build", "index.html")
		);
	});
}
