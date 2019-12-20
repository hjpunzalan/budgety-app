import { TransactionActions, ActionTypes, ITransaction } from "./../actions";

export interface ITransactionResult {
	_id: {
		month: number;
		year: number;
	};
	income: number;
	expense: number;
	transactions: ITransaction[];
}

const initialState: ITransactionResult[] = [];

export const transactionReducer = (
	state = initialState,
	action: TransactionActions
) => {
	switch (action.type) {
		case ActionTypes.getTransactions:
		case ActionTypes.addTransaction:
			return action.payload;
		case ActionTypes.clearTransactions:
			return initialState;
		default:
			return state;
	}
};
