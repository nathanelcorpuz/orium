import bcrypt from "bcrypt";
import User, { UserDocument } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { sendEmailVerificationCode } from "@/lib/emails";
import { HydratedDocument } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Preferences from "@/models/Preferences";

export async function POST(request: NextRequest) {
	await connectDB();
	const { name, email, password, currency } = await request.json();

	const emailExists = await User.exists({ email });

	if (emailExists) {
		return NextResponse.json({
			success: false,
			message: "Email already registered",
		});
	}

	const newAccountDoc: HydratedDocument<UserDocument> = await User.create({
		name,
		email,
		password: await bcrypt.hash(password, Number(process.env.SALT)),
		isVerified: false,
	});

	await Preferences.create({ userId: newAccountDoc._id, currency });

	await sendEmailVerificationCode({
		userId: newAccountDoc._id,
		userEmail: email,
	});

	return NextResponse.json({ success: true, message: "Account created" });
}
