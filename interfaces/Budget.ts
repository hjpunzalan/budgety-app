import { ITransaction } from "./Transaction";
import { IUser } from "./User";
import { Document } from "mongoose";

export interface IBudget extends Document {
	id?: string;
	name: string;
	categories: string[];
	startingBalance: number;
	balance: number;
	transactions: ITransaction[];
	user: IUser;

	checkUser: (userId: string) => boolean;
}
