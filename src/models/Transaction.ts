import mongoose, { Schema, Types, model } from "mongoose";
import { Type } from "@/lib/types";

// These live in the Forecast page

export interface TransactionDocument {
	_id: string;
	userId: string;
	name: string;
	amount: number;
	dueDate: Date;
	type: Type;
	typeId: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

export const TransactionSchema = new Schema<TransactionDocument>(
	{
		userId: { type: String, required: true },
		name: { type: String },
		amount: { type: Number },
		dueDate: { type: Date },
		type: { type: String },
		typeId: { type: Schema.Types.ObjectId },
	},
	{
		timestamps: true,
	}
);

const Transaction =
	mongoose.models?.Transaction ||
	model<TransactionDocument>("Transaction", TransactionSchema);
export default Transaction;
