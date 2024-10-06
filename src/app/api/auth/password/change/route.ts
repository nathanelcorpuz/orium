import bcrypt from "bcrypt";
import { verifyToken } from "@/lib/token";
import User, { UserDocument } from "@/models/User";
import { HydratedDocument } from "mongoose";
import { NextRequest } from "next/server";
import { errorHandler } from "@/lib/error";

export async function PUT(request: NextRequest) {
	try {
		const decoded = await verifyToken();

		const { oldPassword, newPassword } = await request.json();

		const userDoc: HydratedDocument<UserDocument> | null = await User.findById(
			decoded.userId
		);

		if (!userDoc) throw new Error("Account error");

		const isPasswordCorrect = await bcrypt.compare(
			oldPassword,
			userDoc.password
		);

		if (!isPasswordCorrect) throw new Error("Invalid credentials");

		await userDoc.updateOne({ password: newPassword });
	} catch (error) {
		return errorHandler(error as Error);
	}
}
