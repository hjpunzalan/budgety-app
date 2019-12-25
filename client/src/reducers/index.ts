import { currentBudgetReducer } from "./currentBudget";
import { combineReducers } from "redux";
import { budgetsReducer } from "./budgets";
import { transactionReducer, ITransactionResult } from "./transactions";
import { authReducer, AuthState } from "./auth";
import { alertReducer } from "./alerts";
import { IBudget, Alert } from "../actions";
import { ChartStoreState, chartReducer } from "./charts";

export interface StoreState {
	auth: AuthState;
	alerts: Alert;
	budgets: IBudget[];
	currentBudget: IBudget;
	transactions: ITransactionResult[];
	charts: ChartStoreState;
}

export const reducers = combineReducers<StoreState>({
	auth: authReducer,
	alerts: alertReducer,
	budgets: budgetsReducer,
	currentBudget: currentBudgetReducer,
	transactions: transactionReducer,
	charts: chartReducer
});
