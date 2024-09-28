import mongoose, { Schema, Types, model } from "mongoose";

export interface ExtraDocument {
	_id: string;
	userId: Types.ObjectId;
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
		userId: { type: Schema.Types.ObjectId, required: true },
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
