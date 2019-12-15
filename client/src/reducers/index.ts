import { combineReducers } from "redux";
import { budgetReducer } from "./budget";
import { transactionReducer, ITransactionResult } from "./transactions";
import { authReducer, AuthState } from "./auth";
import { alertReducer } from "./alerts";
import { IBudget, Alert } from "../actions";

export interface StoreState {
	auth: AuthState;
	alerts: Alert;
	budget: IBudget[];
	transactions: ITransactionResult[];
}

export const reducers = combineReducers<StoreState>({
	auth: authReducer,
	alerts: alertReducer,
	budget: budgetReducer,
	transactions: transactionReducer
});
