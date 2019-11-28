import { IUser } from "./User";

export interface ITransaction {
	desc: string;
	user?: IUser;
	date?: Date;
	category: string;
	amount: number;
}
