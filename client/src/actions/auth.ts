import { IResetPassState } from "../components/auth/ResetPassword/ResetPassword";
import { IForgotPassState } from "../components/auth/ForgotPassword/ForgotPassword";
import { ChangePassState } from "./../components/auth/ChangePassword";
import axios from "axios";
import { ActionTypes } from "./types";
import { IUser } from "../actions";
import catchAsync from "../utils/catchAsync";
import { setAlert, AlertType } from "./alerts";
import { IRegisterState } from "../components/auth/Register/Register";
import { ClearBudgetAction } from "./budget";

export interface LoginAction {
	type: ActionTypes.loginUser;
	payload: IUser;
}
export interface LogoutAction {
	type: ActionTypes.logoutUser;
}

export interface RegUserAction {
	type: ActionTypes.registerUser;
	payload: IUser;
}

export interface ChangePassAction {
	type: ActionTypes.changePassword;
	payload: IUser;
}

export interface ResetPassAction {
	type: ActionTypes.resetPassword;
	payload: IUser;
}

export interface CheckUserAction {
	type: ActionTypes.checkUser;
	payload: IUser;
}

export const checkUser = () =>
	catchAsync(async dispatch => {
		const res = await axios.get<IUser>("/api/auth/checkuser");

		dispatch({
			type: ActionTypes.checkUser,
			payload: res.data
		});
	});

export const postLogin = (email: string, password: string) =>
	catchAsync(async dispatch => {
		const res = await axios.post<IUser>("/api/auth/login", {
			email,
			password
		});

		dispatch<LoginAction>({
			type: ActionTypes.loginUser,
			payload: res.data
		});

		dispatch(
			setAlert(
				`${res.data.firstName} successfully logged in`,
				AlertType.success
			)
		);
	});

export const getLogout = () =>
	catchAsync(async dispatch => {
		await axios.get("/api/auth/logout");
		dispatch<LogoutAction>({ type: ActionTypes.logoutUser });
		dispatch<ClearBudgetAction>({ type: ActionTypes.clearBudget });
	});

export const registerUser = (form: IRegisterState) =>
	catchAsync(async dispatch => {
		const res = await axios.post<IUser>("/api/users/register", form);
		dispatch<RegUserAction>({
			type: ActionTypes.registerUser,
			payload: res.data
		});
		dispatch(
			setAlert(
				`Welcome ${res.data.firstName}! You have been successfully registered!`,
				AlertType.success
			)
		);
	});

export const changePassword = (form: ChangePassState) =>
	catchAsync(async dispatch => {
		const res = await axios.post<IUser>("/api/auth/changepassword", form);
		dispatch<ChangePassAction>({
			type: ActionTypes.changePassword,
			payload: res.data
		});

		dispatch(setAlert("Password successfully changed!", AlertType.success));
	});

export const postForgotPassword = (form: IForgotPassState, url: string) =>
	catchAsync(async dispatch => {
		await axios.post("/api/auth/forgotpassword", { email: form.email, url });
		dispatch(
			setAlert(`Password reset link sent to ${form.email}.`, AlertType.success)
		);
	});

export const patchResetPassword = (form: IResetPassState, resetToken: string) =>
	catchAsync(async dispatch => {
		const res = await axios.patch<IUser>(
			`/api/auth/resetpassword/${resetToken}`,
			form
		);
		dispatch<ResetPassAction>({
			type: ActionTypes.resetPassword,
			payload: res.data
		});
		dispatch(setAlert("Password changed!", AlertType.success));
	});
