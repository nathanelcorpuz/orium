import mongoose, { Schema, Types, model } from "mongoose";

export interface IncomeDocument {
	_id: string;
	userId: string;
	name: string;
	amount: number;
	frequency: "monthly" | "bi-weekly" | "weekly";
	dayOfWeek: number;
	day: number;
	comments: string;
	transactionIds: [Types.ObjectId];
	createdAt: Date;
	updatedAt: Date;
}

const IncomeSchema = new Schema<IncomeDocument>(
	{
		userId: { type: String, required: true },
		name: String,
		amount: Number,
		frequency: String,
		dayOfWeek: String,
		day: Number,
		comments: String,
		transactionIds: [Schema.Types.ObjectId],
	},
	{
		timestamps: true,
	}
);

const Income =
	mongoose.models?.Income || model<IncomeDocument>("Income", IncomeSchema);
export default Income;
