import mongoose, { Schema, model } from "mongoose";

export interface BalanceDocument {
	_id: string;
	userId: string;
	name: string;
	amount: number;
	comments: string;
	createdAt: Date;
	updatedAt: Date;
}

const BalanceSchema = new Schema<BalanceDocument>(
	{
		userId: { type: String, required: true },
		name: { type: String, required: true },
		amount: Number,
		comments: String,
	},
	{
		timestamps: true,
	}
);

const Balance =
	mongoose.models?.Balance || model<BalanceDocument>("Balance", BalanceSchema);
export default Balance;
