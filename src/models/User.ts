import mongoose, { Schema, model } from "mongoose";

export interface UserDocument {
	_id: string;
	isVerified: boolean;
	isLocked: boolean;
	name: string;
	email: string;
	password: string;
	code: string;
}

const UserSchema = new Schema<UserDocument>({
	isVerified: { type: Boolean, default: false },
	isLocked: { type: Boolean, default: false },
	name: String,
	email: String,
	password: String,
	code: String,
});

const User = mongoose.models?.User || model<UserDocument>("User", UserSchema);
export default User;
