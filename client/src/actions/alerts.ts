import { Dispatch } from "redux";
import { ActionTypes } from "./types";

export enum AlertType {
	success = "success",
	error = "error",
	info = "info",
	warning = "warning"
}

export type Alert = {
	msg: string;
	alertType: AlertType;
};

export interface ResetAlertAction {
	type: ActionTypes.resetAlert;
}

export interface SetAlertAction {
	type: ActionTypes.alert;
	payload: Alert;
}

export const setAlert = (msg: string, alertType: AlertType) => (
	dispatch: Dispatch
) => {
	dispatch<ResetAlertAction>({ type: ActionTypes.resetAlert });
	dispatch<SetAlertAction>({
		type: ActionTypes.alert,
		payload: { msg, alertType }
	});
};

export const resetAlert = () => (dispatch: Dispatch) => {
	dispatch<ResetAlertAction>({
		type: ActionTypes.resetAlert
	});
};
