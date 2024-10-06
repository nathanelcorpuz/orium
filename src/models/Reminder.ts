import mongoose, { Schema, Types, model } from "mongoose";

export interface ReminderDocument {
	_id: string;
	userId: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}

const ReminderSchema = new Schema<ReminderDocument>(
	{
		userId: { type: String, required: true },
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
