import axios from "axios";
import { ITransaction } from "./transaction";
import { ActionTypes } from "./types";
import catchAsync from "../utils/catchAsync";

export interface IBudget {
	_id?: string;
	name: string;
	categories: string[];
	transactions?: ITransaction[];
}

export interface AddBudgetAction {
	type: ActionTypes.addBudget;
	payload: IBudget[];
}

export const addBudget = (name: string, categories: string[]) =>
	catchAsync(async dispatch => {
		// Add new budget
		await axios.post<IBudget>("/api/budget/new", {
			name,
			categories
		});

		// Retrieve new list of user's budget
		const res = await axios.get<IBudget[]>("/api/budget/all");

		dispatch<AddBudgetAction>({
			type: ActionTypes.addBudget,
			payload: res.data
		});
	});
