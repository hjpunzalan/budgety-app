import { TransactionActions, ActionTypes, ITransaction } from "./../actions";

const initialState: ITransaction[] = [];

export const transactionReducer = (
	state = initialState,
	action: TransactionActions
) => {
	switch (action.type) {
		case ActionTypes.addTransaction:
			return action.payload;
		default:
			return state;
	}
};
