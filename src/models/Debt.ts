import mongoose, { Schema, Types, model } from "mongoose";

export interface DebtDocument {
	_id: string;
	userId: string;
	name: string;
	amount: number;
	day: number;
	startDate: Date;
	endDate: Date;
	comments: string;
	transactionIds: [Types.ObjectId];
	createdAt: Date;
	updatedAt: Date;
}

const DebtSchema = new Schema<DebtDocument>(
	{
		userId: { type: String, required: true },
		name: { type: String, required: true },
		amount: { type: Number, required: true },
		day: { type: Number, required: true },
		startDate: { type: Date, required: true },
		endDate: { type: Date, required: true },
		comments: String,
		transactionIds: [Schema.Types.ObjectId],
	},
	{
		timestamps: true,
	}
);

const Debt = mongoose.models?.Debt || model<DebtDocument>("Debt", DebtSchema);
export default Debt;
