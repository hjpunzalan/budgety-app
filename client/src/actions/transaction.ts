import { setAlert, AlertType } from "./alerts";
import axios from "axios";
import { ActionTypes } from "./types";
import { IUser } from "./user";
import catchAsync from "../utils/catchAsync";
import { AddTransactionForm } from "../components/pages/AddTransaction/AddTransaction";
import { ITransactionResult } from "../reducers/transactions";
import { Dispatch } from "redux";

export interface ITransaction {
	_id?: string;
	desc: string;
	user?: IUser;
	date: Date;
	categoryIndex: number;
	amount: number;
	balance: number;
}

// Transaction may be of any date!
// Will need to refresh the transaction list
export interface AddTransactionAction {
	type: ActionTypes.addTransaction;
	payload: ITransactionResult[];
}

export interface GetTransactionsAction {
	type: ActionTypes.getTransactions;
	payload: ITransactionResult[];
}

export interface ClearTransactionsAction {
	type: ActionTypes.clearTransactions;
}

export const clearTransactions = () => (dispatch: Dispatch) => {
	dispatch<ClearTransactionsAction>({
		type: ActionTypes.clearTransactions
	});
};

export const getTransactions = (
	budgetId: string,
	pageNumber: number = 1,
	setHasMore?: (hasMore: boolean) => void
) =>
	catchAsync(async dispatch => {
		// If first page - clear list first
		if (pageNumber === 1)
			dispatch<ClearTransactionsAction>({
				type: ActionTypes.clearTransactions
			});

		const res = await axios.get<ITransactionResult[]>(
			`/api/transactions/${budgetId}?page=${pageNumber}&limit=20`
		);

		dispatch<GetTransactionsAction>({
			type: ActionTypes.getTransactions,
			payload: res.data
		});

		// Must be after dispatch
		// If this is called before dispatch, multiple calls will be executed
		// Many duplicate calls will happen as a result
		if (setHasMore) {
			if (res.data.length === 0) {
				setHasMore(false);
			} else setHasMore(true);
		}
	});

export const addTransaction = (budgetId: string, form: AddTransactionForm) =>
	catchAsync(async dispatch => {
		const res = await axios.patch<ITransactionResult[]>(
			`/api/transactions/new/${budgetId}`,
			form
		);

		dispatch<AddTransactionAction>({
			type: ActionTypes.addTransaction,
			payload: res.data
		});

		dispatch(setAlert("New transaction added!", AlertType.success));
	});
