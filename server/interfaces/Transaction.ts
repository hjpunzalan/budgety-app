import { IUser } from "./User";

export interface ITransaction {
	_id?: string;
	desc: string;
	user?: IUser;
	date?: Date;
	categoryIndex: number;
	amount: number;
	balance: number;
}
