import bcrypt from "bcrypt";
import User, { UserDocument } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { errorHandler } from "@/lib/error";
import { sendEmailVerification } from "@/lib/emails";
import { HydratedDocument } from "mongoose";
import { connectDB } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
	try {
		await connectDB();
		const { name, email, password } = await request.json();

		const emailExists = await User.exists({ email });

		if (emailExists) throw new Error("Email already registered");

		const newAccountDoc: HydratedDocument<UserDocument> = await User.create({
			name,
			email,
			password: await bcrypt.hash(password, Number(process.env.SALT)),
			isVerified: false,
		});

		await sendEmailVerification({
			userId: newAccountDoc._id,
			userEmail: email,
		});

		return new NextResponse(JSON.stringify({ message: "success" }));
	} catch (error) {
		return errorHandler(error as Error);
	}
}
