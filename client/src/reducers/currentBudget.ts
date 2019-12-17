import {
	ActionTypes,
	IBudget,
	ClearBudgetAction,
	GetBudgetAction
} from "../actions";

const initialState: IBudget = {
	name: "",
	startingBalance: 0,
	balance: 0,
	categories: [""]
};

export const currentBudgetReducer = (
	state = initialState,
	action: GetBudgetAction | ClearBudgetAction
) => {
	switch (action.type) {
		case ActionTypes.getBudget:
			return action.payload;
		case ActionTypes.clearBudget:
			return initialState;
		default:
			return state;
	}
};
