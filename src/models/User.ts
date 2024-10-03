import mongoose, { Schema, Types, model } from "mongoose";

export interface UserDocument {
	_id: string;
	email: string;
	password: string;
	name: string;
	transactionIds: [Types.ObjectId];
	billIds: [Types.ObjectId];
	incomeIds: [Types.ObjectId];
	debtIds: [Types.ObjectId];
	extraIds: [Types.ObjectId];
	balanceIds: [Types.ObjectId];
	savingsIds: [Types.ObjectId];
	reminderIds: [Types.ObjectId];
	createdAt: Date;
	updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
	{
		email: {
			type: String,
			unique: true,
			required: [true, "Email is required"],
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				"Email is invalid",
			],
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: [true, "Name is required"],
		},
		transactionIds: [
			{ type: Types.ObjectId, required: true, ref: "Transaction" },
		],
		billIds: [{ type: Types.ObjectId, required: true, ref: "Bill" }],
		incomeIds: [{ type: Types.ObjectId, required: true, ref: "Income" }],
		debtIds: [{ type: Types.ObjectId, required: true, ref: "Debt" }],
		extraIds: [{ type: Types.ObjectId, required: true, ref: "Extra" }],
		balanceIds: [{ type: Types.ObjectId, required: true, ref: "Balance" }],
		savingsIds: [{ type: Types.ObjectId, required: true, ref: "Savings" }],
		reminderIds: [{ type: Types.ObjectId, required: true, ref: "Reminder" }],
	},
	{
		timestamps: true,
	}
);

const User = mongoose.models?.User || model<UserDocument>("User", UserSchema);
export default User;
