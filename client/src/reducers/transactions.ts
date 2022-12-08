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
			// If state already empty
			if (state.length === 0) return action.payload;
			else {
				// Cant put state to a variable as it doesnt like it and will create bugs
				action.payload.forEach(newGroup => {
					// Initiate existAlready
					let existAlready = false;
					for (let group of state) {
						// Find if newGroup already exist within transaction groups
						if (
							group._id.month === newGroup._id.month &&
							group._id.year === newGroup._id.year
						) {
							// Update group transactions
							// Be wary of duplicates
							group.transactions = [
								...group.transactions,
								...newGroup.transactions
							];

							// Set exist to true if found match
							existAlready = true;
							break;
						}
					}
					if (!existAlready) {
						// Conditional to add new group to transaction after loop
						state.push(newGroup);
					}
				});

				/// If newGroup doesnt exist in all of the current groups, add the new group to the transaction
				return state;
			}
		case ActionTypes.addTransaction:
			return action.payload;
		case ActionTypes.clearTransactions:
		case ActionTypes.logoutUser:
			return initialState;
		default:
			return state;
	}
};
