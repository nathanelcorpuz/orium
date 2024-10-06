import mongoose, { Schema, Types, model } from "mongoose";

export interface ExtraDocument {
	_id: string;
	userId: string;
	name: string;
	amount: number;
	date: Date;
	comments: string;
	transactionId: Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

const ExtraSchema = new Schema<ExtraDocument>(
	{
		userId: { type: String, required: true },
		name: String,
		amount: Number,
		date: Date,
		comments: String,
		transactionId: Schema.Types.ObjectId,
	},
	{
		timestamps: true,
	}
);

const Extra =
	mongoose.models?.Extra || model<ExtraDocument>("Extra", ExtraSchema);
export default Extra;
