import {
	BudgetStats,
	BudgetCategoryData,
	BudgetDates
} from "./../reducers/charts";
import { setAlert, AlertType } from "./alerts";
import axios from "axios";
import { ITransaction } from "./transaction";
import { ActionTypes } from "./types";
import catchAsync from "../utils/catchAsync";
import { AddBudgetState } from "../components/pages/AddBudget/AddBudget";
import { EditBudgetForm } from "../components/pages/EditBudget/EditBudget";

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

export interface GetAllBudgetAction {
	type: ActionTypes.getAllBudget;
	payload: IBudget[];
}

export interface EditBudgetAction {
	type: ActionTypes.editBudget;
	payload: IBudget[];
}

export interface DeleteBudgetAction {
	type: ActionTypes.deleteBudget;
	payload: IBudget;
}

export interface GetBudgetAction {
	type: ActionTypes.getBudget;
	payload: IBudget;
}

export interface GetStatsAction {
	type: ActionTypes.getStats;
	payload: BudgetStats[];
}

export interface GetCategoryDataAction {
	type: ActionTypes.getCategoryData;
	payload: BudgetCategoryData[];
}

export interface GetDatesAction {
	type: ActionTypes.getDates;
	payload: BudgetDates[];
}

export const addBudget = (form: AddBudgetState) =>
	catchAsync(async dispatch => {
		// Add new budget
		const res = await axios.post<IBudget>("/api/budget/new", form);

		dispatch<AddBudgetAction>({
			type: ActionTypes.addBudget,
			payload: res.data
		});

		dispatch(setAlert(`${form.name} budget added to list!`, AlertType.success));
	});

export const getAllBudget = () =>
	catchAsync(async dispatch => {
		const res = await axios.get<IBudget[]>("/api/budget/all");

		dispatch<GetAllBudgetAction>({
			type: ActionTypes.getAllBudget,
			payload: res.data
		});
	});

export const editBudget = (budgetId: string, form: EditBudgetForm) =>
	catchAsync(async dispatch => {
		const res = await axios.patch<IBudget[]>(
			`/api/budget/update/${budgetId}`,
			form
		);

		dispatch<EditBudgetAction>({
			type: ActionTypes.editBudget,
			payload: res.data
		});

		dispatch(
			setAlert(`Budget ${form.name} successfully updated!`, AlertType.success)
		);
	});

export const deleteBudget = (budget: IBudget) =>
	catchAsync(async dispatch => {
		await axios.delete(`/api/budget/del/${budget._id}`);

		dispatch<DeleteBudgetAction>({
			type: ActionTypes.deleteBudget,
			payload: budget
		});
		dispatch(
			setAlert(`Budget ${budget.name} successfully deleted!`, AlertType.success)
		);
	});

export const getBudget = (budgetId: string) =>
	catchAsync(async dispatch => {
		const res = await axios.get<IBudget>(`/api/budget/${budgetId}`);

		dispatch<GetBudgetAction>({
			type: ActionTypes.getBudget,
			payload: res.data
		});
	});

export const getStats = (budgetId: string, year: number) =>
	catchAsync(async dispatch => {
		const res = await axios.get<BudgetStats[]>(
			`/api/budget/stats/${budgetId}/year/${year}`
		);

		dispatch<GetStatsAction>({
			type: ActionTypes.getStats,
			payload: res.data
		});
	});

export const getCategoryData = (
	budgetId: string,
	month: number,
	year: number
) =>
	catchAsync(async dispatch => {
		const res = await axios.get<BudgetCategoryData[]>(
			`/api/budget/categories/${budgetId}/month/${month}/year/${year}`
		);

		dispatch<GetCategoryDataAction>({
			type: ActionTypes.getCategoryData,
			payload: res.data
		});
	});

export const getDates = (budgetId: string) =>
	catchAsync(async dispatch => {
		const res = await axios.get<BudgetDates[]>(`/api/budget/dates/${budgetId}`);

		dispatch<GetDatesAction>({
			type: ActionTypes.getDates,
			payload: res.data
		});
	});
