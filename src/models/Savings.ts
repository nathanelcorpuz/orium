import mongoose, { Schema, Types, model } from "mongoose";

export interface SavingsDocument {
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

const SavingsSchema = new Schema<SavingsDocument>(
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

const Savings =
	mongoose.models?.Savings || model<SavingsDocument>("Savings", SavingsSchema);
export default Savings;
