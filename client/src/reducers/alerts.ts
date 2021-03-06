import { ActionTypes, AlertActions, Alert, AlertType } from "../actions";

const initialState: Alert = {
	msg: "",
	alertType: AlertType.success
};

export const alertReducer = (state = initialState, action: AlertActions) => {
	switch (action.type) {
		case ActionTypes.alert:
			return action.payload;

		case ActionTypes.resetAlert:
			return initialState;
		default:
			return state;
	}
};
