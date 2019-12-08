import { IUser } from "./User";

export interface ITransaction {
	_id?: string;
	desc: string;
	user?: IUser;
	date?: Date;
	category: string;
	amount: number;
	balance: number;
}
