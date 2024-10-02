import mongoose, { Schema, Types, model } from "mongoose";

export interface BalanceDocument {
	_id: string;
	userId: Types.ObjectId;
	name: string;
	amount: number;
	comments: string;
	createdAt: Date;
	updatedAt: Date;
}

const BalanceSchema = new Schema<BalanceDocument>(
	{
		userId: { type: Schema.Types.ObjectId, required: true },
		name: String,
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
