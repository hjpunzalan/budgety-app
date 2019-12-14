import { budgetReducer } from "./budget";
import { combineReducers } from "redux";
import { authReducer, AuthState } from "./auth";
import { alertReducer } from "./alerts";
import { IBudget, Alert } from "../actions";

export interface StoreState {
	auth: AuthState;
	alerts: Alert;
	budget: IBudget[];
}

export const reducers = combineReducers<StoreState>({
	auth: authReducer,
	alerts: alertReducer,
	budget: budgetReducer
});
