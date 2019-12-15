import { combineReducers } from "redux";
import { budgetReducer } from "./budget";
import { transactionReducer } from "./transactions";
import { authReducer, AuthState } from "./auth";
import { alertReducer } from "./alerts";
import { IBudget, Alert, ITransaction } from "../actions";

export interface StoreState {
	auth: AuthState;
	alerts: Alert;
	budget: IBudget[];
	transactions: ITransaction[];
}

export const reducers = combineReducers<StoreState>({
	auth: authReducer,
	alerts: alertReducer,
	budget: budgetReducer,
	transactions: transactionReducer
});
