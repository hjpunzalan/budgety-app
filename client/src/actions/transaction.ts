import { setAlert, AlertType } from "./alerts";
import axios from "axios";
import { ActionTypes } from "./types";
import { IUser } from "./user";
import catchAsync from "../utils/catchAsync";
import { AddTransactionForm } from "../components/pages/AddTransaction/AddTransaction";

export interface ITransaction {
	_id?: string;
	desc: string;
	user?: IUser;
	date?: Date;
	categoryIndex: number;
	amount: number;
}

// Transaction may be of any date!
// Will need to refresh the transaction list
export interface AddTransactionAction {
	type: ActionTypes.addTransaction;
	payload: ITransaction[];
}

export const addTransaction = (budgetId: string, form: AddTransactionForm) =>
	catchAsync(async dispatch => {
		const res = await axios.patch<ITransaction[]>(
			`/api/transactions/new/${budgetId}`,
			form
		);

		dispatch<AddTransactionAction>({
			type: ActionTypes.addTransaction,
			payload: res.data
		});

		dispatch(setAlert("New transaction added!", AlertType.success));
	});
