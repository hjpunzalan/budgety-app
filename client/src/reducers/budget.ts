import { BudgetActions, ActionTypes, IBudget } from "./../actions";

const initialState: IBudget[] = [];

export const budgetReducer = (state = initialState, action: BudgetActions) => {
	switch (action.type) {
		case ActionTypes.addBudget:
			return action.payload;
		default:
			return state;
	}
};
