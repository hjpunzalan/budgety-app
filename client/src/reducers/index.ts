import { budgetReducer } from "./budget";
import { combineReducers } from "redux";
import { authReducer, AuthState } from "./auth";
import { alertReducer, AlertState } from "./alerts";
import { userReducer } from "./users";
import { IUser, IBudget } from "../actions";

export interface StoreState {
	auth: AuthState;
	users: IUser[];
	alerts: AlertState;
	budget: IBudget[];
}

export const reducers = combineReducers<StoreState>({
	auth: authReducer,
	users: userReducer,
	alerts: alertReducer,
	budget: budgetReducer
});
