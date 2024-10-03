import mongoose, { Schema, Types, model } from "mongoose";

export interface ReminderDocument {
	_id: string;
	userId: Types.ObjectId;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}

const ReminderSchema = new Schema<ReminderDocument>(
	{
		userId: { type: Schema.Types.ObjectId, required: true },
		content: String,
	},
	{
		timestamps: true,
	}
);

const Reminder =
	mongoose.models?.Reminder ||
	model<ReminderDocument>("Reminder", ReminderSchema);
export default Reminder;
