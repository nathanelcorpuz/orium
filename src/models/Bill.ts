import mongoose, { Schema, Types, model } from "mongoose";

export interface BillDocument {
	_id: string;
	userId: Types.ObjectId;
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
		userId: { type: Schema.Types.ObjectId, required: true },
		name: String,
		amount: Number,
		day: Number,
		comments: String,
		transactionIds: [Schema.Types.ObjectId],
	},
	{
		timestamps: true,
	}
);

const Bill = mongoose.models?.Bill || model<BillDocument>("Bill", BillSchema);
export default Bill;
