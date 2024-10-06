import mongoose, { Schema, Types, model } from "mongoose";
import { Type } from "@/lib/types";

export interface HistoryDocument {
	_id: string;
	userId: string;
	name: string;
	forecastedAmount: number;
	actualAmount: number;
	forecastedDate: Date;
	actualDate: Date;
	type: Type;
	typeId: Types.ObjectId;
	forecastedBalance: number;
	actualBalance: number;
	createdAt: Date;
	updatedAt: Date;
}

const HistorySchema = new Schema<HistoryDocument>(
	{
		userId: { type: String, required: true },
		name: String,
		forecastedAmount: Number,
		actualAmount: Number,
		forecastedDate: Date,
		actualDate: Date,
		type: String,
		typeId: Schema.Types.ObjectId,
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
