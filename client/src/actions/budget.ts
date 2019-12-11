import axios from "axios";
import { ITransaction } from "./transaction";
import { ActionTypes } from "./types";
import catchAsync from "../utils/catchAsync";
import { AddBudgetState } from "../components/pages/AddBudget/AddBudget";

export interface IBudget {
	_id?: string;
	name: string;
	categories: string[];
	startingBalance: number;
	balance: number;
	transactions?: ITransaction[];
}

export interface AddBudgetAction {
	type: ActionTypes.addBudget;
	payload: IBudget;
}

export interface getAllBudgetAction {
	type: ActionTypes.getAllBudget;
	payload: IBudget[];
}

export const addBudget = (form: AddBudgetState) =>
	catchAsync(async dispatch => {
		// Add new budget
		const res = await axios.post<IBudget>("/api/budget/new", form);

		dispatch<AddBudgetAction>({
			type: ActionTypes.addBudget,
			payload: res.data
		});
	});

export const getAllBudget = () =>
	catchAsync(async dispatch => {
		const res = await axios.get<IBudget[]>("/api/budget/all");

		dispatch<getAllBudgetAction>({
			type: ActionTypes.getAllBudget,
			payload: res.data
		});
	});
