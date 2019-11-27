import { ITransaction } from "./Transaction";
import { IUser } from "./User";
import { Document } from "mongoose";

export interface IBudget extends Document {
	name: string;
	categories: string[];
	transactions: ITransaction[];
	members: IUser[];

	checkUser: (userId: string) => boolean;
}
