import { ITransaction } from "./Transaction";
import { IUser } from "./User";
import { Document } from "mongoose";

export interface IBudget extends Document {
	id?: string;
	name: string;
	categories: string[];
	transactions: ITransaction[];
	user: IUser;

	checkUser: (userId: string) => boolean;
}
