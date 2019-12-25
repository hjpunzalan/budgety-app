import { LogoutAction } from "./../actions/auth";
import { ActionTypes, IBudget, GetBudgetAction } from "../actions";

const initialState: IBudget = {
	name: "",
	startingBalance: 0,
	balance: 0,
	categories: [""]
};

export const currentBudgetReducer = (
	state = initialState,
	action: GetBudgetAction | LogoutAction
) => {
	switch (action.type) {
		case ActionTypes.getBudget:
			return action.payload;
		case ActionTypes.logoutUser:
			return initialState;
		default:
			return state;
	}
};
