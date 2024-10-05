"use server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/Preferences";
import bcrypt from "bcryptjs";

interface Values {
	email: string;
	password: string;
	name: string;
}

export const register = async (values: Values) => {
	const { email, password, name } = values;

	try {
		await connectDB();
		const userFound = await User.findOne({ email });
		if (userFound) {
			return {
				error: "Email already exists!",
			};
		}
		const hashedPassword = await bcrypt.hash(password, 10);
		const user = new User({
			name,
			email,
			password: hashedPassword,
		});
		await user.save();
	} catch (e) {
		console.log(e);
	}
};
