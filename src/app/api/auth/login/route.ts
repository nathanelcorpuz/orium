import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongodb";
import User, { UserDocument } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { HydratedDocument } from "mongoose";
import { addDays } from "date-fns";

export async function POST(request: NextRequest) {
	await connectDB();
	interface Body {
		email: string;
		password: string;
	}

	const { email, password }: Body = await request.json();

	const userDoc: HydratedDocument<UserDocument> | null = await User.findOne({
		email,
	});

	if (!userDoc) {
		return NextResponse.json({
			success: false,
			message: "Invalid credentials",
		});
	}

	if (userDoc.isLocked)
		return NextResponse.json({
			success: false,
			message:
				"Account locked, please reach out to oriumsupport@gmail.com for assistance",
		});

	const isPasswordCorrect = await bcrypt.compare(password, userDoc.password);

	if (!isPasswordCorrect) {
		return NextResponse.json({
			success: false,
			message: "Invalid credentials",
		});
	}

	const token = jwt.sign(
		{ userId: userDoc._id },
		String(process.env.AUTH_TOKEN_SECRET),
		{ expiresIn: "7d" }
	);

	return new NextResponse(
		JSON.stringify({ success: true, message: "Log in success" }),
		{
			status: 200,
			headers: {
				"Set-Cookie": `token=${token}; Expires=${addDays(
					new Date(),
					7
				)}; Secure; HttpOnly; Path=/`,
			},
		}
	);
}
