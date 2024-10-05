// import mongoose, { Schema, model } from "mongoose";

// export interface UserDocument {
// 	_id: string;
// 	userId: string;
// 	password: string;
// 	name: string;
// 	createdAt: Date;
// 	updatedAt: Date;
// }

// const UserSchema = new Schema<UserDocument>(
// 	{
// 		userId: { type: String, unique: true },
// 		name: {
// 			type: String,
// 			required: [true, "Name is required"],
// 		},
// 	},
// 	{
// 		timestamps: true,
// 	}
// );

// const User = mongoose.models?.User || model<UserDocument>("User", UserSchema);
// export default User;
