import mongoose, { Schema, Types, model } from "mongoose";

export interface IncomeDocument {
	_id: string;
	userId: Types.ObjectId;
	name: string;
	amount: number;
	frequency: "monthly" | "bi-weekly" | "weekly";
	dayOfWeek: number;
	day: Number;
	comments: string;
	transactionIds: [Types.ObjectId];
	createdAt: Date;
	updatedAt: Date;
}

const IncomeSchema = new Schema<IncomeDocument>(
	{
		userId: { type: Schema.Types.ObjectId, required: true },
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
