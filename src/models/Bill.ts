import mongoose, { Schema, Types, model } from "mongoose";

export interface BillDocument {
	_id: string;
	userId: string;
	name: string;
	amount: number;
	day: number;
	comments: string;
	transactionIds: [Types.ObjectId];
	createdAt: Date;
	updatedAt: Date;
}

const BillSchema = new Schema<BillDocument>(
	{
		userId: { type: String, required: true },
		name: { type: String, required: true },
		amount: Number,
		day: { type: Number, required: true },
		comments: String,
		transactionIds: [Schema.Types.ObjectId],
	},
	{
		timestamps: true,
	}
);

const Bill = mongoose.models?.Bill || model<BillDocument>("Bill", BillSchema);
export default Bill;
