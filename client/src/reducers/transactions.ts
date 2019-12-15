import { TransactionActions, ActionTypes, ITransaction } from "./../actions";

export interface ITransactionResult {
	_id: {
		month: number;
		year: number;
	};
	income: number;
	expense: number;
	balance: number;
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
		default:
			return state;
	}
};
