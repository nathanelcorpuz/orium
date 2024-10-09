import bcrypt from "bcrypt";
import { verifyToken } from "@/lib/token";
import User, { UserDocument } from "@/models/User";
import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { sendPasswordChangedConfirmation } from "@/lib/emails";

export async function PUT(request: NextRequest) {
	await connectDB();

	const auth = await verifyToken();

	if (!auth.success) return NextResponse.json(auth);

	const { password, newPassword } = await request.json();

	if (password === newPassword) {
		return NextResponse.json({
			success: false,
			message: "Old and new passwords are the same",
		});
	}

	const userDoc: HydratedDocument<UserDocument> | null = await User.findById(
		auth.userId
	);

	if (!userDoc) {
		return NextResponse.json({
			success: false,
			message: "Account error",
		});
	}

	const isPasswordCorrect = await bcrypt.compare(password, userDoc.password);

	if (!isPasswordCorrect) {
		return NextResponse.json({
			success: false,
			message: "Invalid credentials",
		});
	}

	await userDoc.updateOne({
		password: await bcrypt.hash(newPassword, Number(process.env.SALT)),
	});

	await sendPasswordChangedConfirmation({ userEmail: userDoc.email });

	return NextResponse.json({ success: true, message: "Password changed" });
}
