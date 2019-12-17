import { BudgetActions, ActionTypes, IBudget } from "./../actions";

const initialState: IBudget[] = [];

export const budgetsReducer = (state = initialState, action: BudgetActions) => {
	switch (action.type) {
		case ActionTypes.addBudget:
			return [...state, action.payload];
		case ActionTypes.getAllBudget:
		case ActionTypes.editBudget:
			return action.payload;
		case ActionTypes.clearBudget:
			return [];
		case ActionTypes.deleteBudget:
			// Filter new budget list without the deleted budget
			return state.filter(b => b._id !== action.payload._id);
		default:
			return state;
	}
};
