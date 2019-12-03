import { IUser } from "./user";

export interface ITransaction {
	_id?: string;
	desc: string;
	user?: IUser;
	date?: Date;
	category: string;
	amount: number;
}
