import mongoose, { Schema, Types, model } from "mongoose";
import { Type } from "@/lib/types";

export interface HistoryDocument {
	_id: string;
	userId: Types.ObjectId;
	name: string;
	forecastedAmount: number;
	actualAmount: number;
	date: Date;
	type: Type;
	forecastedBalance: number;
	actualBalance: number;
	createdAt: Date;
	updatedAt: Date;
}

const HistorySchema = new Schema<HistoryDocument>(
	{
		userId: { type: Schema.Types.ObjectId, required: true },
		name: { type: String },
		forecastedAmount: Number,
		actualAmount: Number,
		date: Date,
		type: String,
		forecastedBalance: Number,
		actualBalance: Number,
	},
	{
		timestamps: true,
	}
);

const History =
	mongoose.models?.History || model<HistoryDocument>("History", HistorySchema);
export default History;
