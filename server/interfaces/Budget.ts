import { IUser } from "./User";
import { Document } from "mongoose";

export interface IBudget extends Document {
	name: string;
	categories: string[];
	transactions: [
		{
			desc: string;
			user: IUser;
			date?: Date;
			category: string;
			amount: number;
		}
	];
	members: IUser[];
}
