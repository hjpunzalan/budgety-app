import axios from "axios";
import { ITransaction } from "./transaction";
import { IUser } from "./user";
import { ActionTypes } from "./types";
import catchAsync from "../utils/catchAsync";

export interface IBudget {
	name: string;
	categories: string[];
	transactions: ITransaction[];
	members: IUser[];
}

export interface AddBudgetAction {
	type: ActionTypes.addBudget;
	payload: IBudget;
}

export const addBudget = (name: string, categories: string[]) =>
	catchAsync(async dispatch => {
		const res = await axios.post<IBudget>("/api/budget/new", {
			name,
			categories
		});

		dispatch<AddBudgetAction>({
			type: ActionTypes.addBudget,
			payload: res.data
		});
	});
