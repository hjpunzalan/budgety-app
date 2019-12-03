import { budgetReducer } from "./budget";
import { combineReducers } from "redux";
import { authReducer, AuthState } from "./auth";
import { alertReducer, AlertState } from "./alerts";
import { IBudget } from "../actions";

export interface StoreState {
	auth: AuthState;
	alerts: AlertState;
	budget: IBudget[];
}

export const reducers = combineReducers<StoreState>({
	auth: authReducer,
	alerts: alertReducer,
	budget: budgetReducer
});
