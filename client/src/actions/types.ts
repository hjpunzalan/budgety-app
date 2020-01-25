import {
	AddTransactionAction,
	GetTransactionsAction,
	ClearTransactionsAction
} from "./transaction";
import { UpdateUserAction } from "./user";
import { SetAlertAction, ResetAlertAction } from "./alerts";
import {
	LoginAction,
	LogoutAction,
	RegUserAction,
	ChangePassAction,
	ResetPassAction,
	CheckUserAction
} from "./auth";
import {
	AddBudgetAction,
	GetAllBudgetAction,
	EditBudgetAction,
	DeleteBudgetAction,
	GetCategoryDataAction,
	GetStatsAction,
	GetDatesAction
} from "./budget";

export enum ActionTypes {
	// unique val
	// KEY[0] = 0,
	// KEY[1] = 1
	// Added initializer for redux devtools
	alert = "ALERT",
	resetAlert = "RESET_ALERT",
	registerUser = "REGISTER_USER",
	loginUser = "LOGIN_USER",
	logoutUser = "LOGOUT_USER",
	changePassword = "CHANGE_PASSWORD",
	updateUser = "UPDATE_USER",
	forgotPassword = "FORGOT_PASSWORD",
	resetPassword = "RESET_PASSWORD",
	checkUser = "CHECK_AUTH",
	//
	// BUDGET
	addBudget = "ADD_BUDGET",
	getAllBudget = "GET_ALL_BUDGET",
	clearBudget = "CLEAR_BUDGET",
	editBudget = "EDIT_BUDGET",
	deleteBudget = "DELETE_BUDGET",
	getBudget = "GET_BUDGET",
	//
	//  TRANSACTIONS
	addTransaction = "ADD_TRANSACTION",
	getTransactions = "GET_TRANSACTIONS",
	clearTransactions = "CLEAR_TRANSACTIONS",

	// CHARTS
	getStats = "GET_STATS",
	getCategoryData = "GET_CATEGORY_DATA",
	getDates = "GET_DATES"
}

// export type UserActions = ;
export type AuthActions =
	| LoginAction
	| LogoutAction
	| RegUserAction
	| ChangePassAction
	| UpdateUserAction
	| ResetPassAction
	| CheckUserAction;
export type AlertActions = SetAlertAction | ResetAlertAction;
export type BudgetActions =
	| AddBudgetAction
	| GetAllBudgetAction
	| EditBudgetAction
	| DeleteBudgetAction
	| LogoutAction;

export type ChartActions =
	| GetCategoryDataAction
	| GetStatsAction
	| LogoutAction
	| GetDatesAction;

export type TransactionActions =
	| AddTransactionAction
	| GetTransactionsAction
	| ClearTransactionsAction
	| LogoutAction;
