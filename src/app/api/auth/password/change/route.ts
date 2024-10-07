import bcrypt from "bcrypt";
import { verifyToken } from "@/lib/token";
import User, { UserDocument } from "@/models/User";
import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import { sendPasswordChangedConfirmation } from "@/lib/emails";

export async function PUT(request: NextRequest) {
	try {
		await connectDB();

		const decoded = await verifyToken();

		const { password, newPassword } = await request.json();

		if (password === newPassword)
			throw new Error("Old and new passwords are the same");

		const userDoc: HydratedDocument<UserDocument> | null = await User.findById(
			decoded.userId
		);

		if (!userDoc) throw new Error("Account error");

		const isPasswordCorrect = await bcrypt.compare(password, userDoc.password);

		if (!isPasswordCorrect) throw new Error("Invalid credentials");

		await userDoc.updateOne({
			password: await bcrypt.hash(newPassword, Number(process.env.SALT)),
		});

		await sendPasswordChangedConfirmation({ userEmail: userDoc.email });

		return NextResponse.json({ message: "Success" });
	} catch (error) {
		return errorHandler(error as Error);
	}
}
