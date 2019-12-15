import { UpdateMeForm } from "./../components/pages/UpdateMe/UpdateMe";
import { AlertType, setAlert } from "./alerts";
import { ActionTypes } from "./types";
import axios from "axios";
import catchAsync from "../utils/catchAsync";

// Compatible with updateMe state also
export interface IUser {
	active?: boolean;
	_id?: string;
	role?: string;
	firstName: string;
	lastName: string;
	email: string;
	password?: string;
	passwordChangedAt?: Date;
}

export interface UpdateUserAction {
	type: ActionTypes.updateUser;
	payload: IUser;
}

export const updateUser = (form: UpdateMeForm) =>
	catchAsync(async dispatch => {
		const res = await axios.patch<IUser>("/api/users/updateMe", form);

		dispatch<UpdateUserAction>({
			type: ActionTypes.updateUser,
			payload: res.data
		});

		dispatch(setAlert("User successfully updated!", AlertType.success));
	});
