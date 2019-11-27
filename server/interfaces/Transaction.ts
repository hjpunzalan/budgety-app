import { IUser } from "./User";
import { Document } from "mongoose";

export interface ITransaction extends Document {
	desc: string;
	user: IUser;
	date?: Date;
	category: string;
	amount: number;
}
