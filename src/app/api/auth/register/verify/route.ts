import jwt from "jsonwebtoken";
import User, { UserDocument } from "@/models/User";
import { addDays, differenceInMinutes } from "date-fns";
import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { sendSignUpSuccess } from "@/lib/emails";

const { AUTH_TOKEN_SECRET } = process.env;

export async function POST(request: NextRequest) {
	await connectDB();

	const { digits, email } = await request.json();

	const userDoc: HydratedDocument<UserDocument> | null = await User.findOne({
		email: decodeURIComponent(email),
	});

	if (!userDoc) {
		return NextResponse.json({
			success: false,
			message: "No account found",
		});
	}

	if (userDoc.isVerified) {
		return NextResponse.json({
			success: false,
			message: "Already verified",
		});
	}

	const docDigits = userDoc.code.slice(0, 6);

	if (Number(digits) !== Number(docDigits)) {
		return NextResponse.json({
			success: false,
			message: "Invalid code",
		});
	}

	const docTimestamp = userDoc.code.slice(6);

	const isExpired = differenceInMinutes(new Date(), docTimestamp) > 5;

	if (isExpired) {
		return NextResponse.json({
			success: false,
			message: "Code expired",
		});
	}

	const token = jwt.sign({ userId: userDoc._id }, String(AUTH_TOKEN_SECRET), {
		expiresIn: "7d",
	});

	await userDoc.updateOne({ isVerified: true });

	await sendSignUpSuccess({ userEmail: userDoc.email });

	return new NextResponse(
		JSON.stringify({ success: true, message: "Account verified" }),
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
