import mongoose, { Schema, Types, model } from "mongoose";

export interface DebtDocument {
	_id: string;
	userId: Types.ObjectId;
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
		userId: { type: Schema.Types.ObjectId, required: true },
		name: String,
		amount: Number,
		day: Number,
		startDate: Date,
		endDate: Date,
		comments: String,
		transactionIds: [Schema.Types.ObjectId],
	},
	{
		timestamps: true,
	}
);

const Debt = mongoose.models?.Debt || model<DebtDocument>("Debt", DebtSchema);
export default Debt;
