import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { UserDocument } from "@/models/User";
import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { addDays, differenceInMinutes } from "date-fns";
import { sendPasswordChangedConfirmation } from "@/lib/emails";
import { connectDB } from "@/lib/mongodb";

export async function PUT(request: NextRequest) {
	await connectDB();

	const { newPassword, digits, email: undecodedEmail } = await request.json();

	const email = decodeURIComponent(undecodedEmail);

	const userDoc: HydratedDocument<UserDocument> | null = await User.findOne({
		email,
	});

	if (!userDoc) {
		return NextResponse.json({
			success: false,
			message: "User not found",
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

	const isOldPassword = await bcrypt.compare(newPassword, userDoc.password);

	if (isOldPassword) {
		return NextResponse.json({
			success: false,
			message: "This is your current password, sign in instead.",
		});
	}

	await userDoc.updateOne({
		password: await bcrypt.hash(newPassword, Number(process.env.SALT)),
		isLocked: false,
	});

	const token = jwt.sign(
		{ userId: userDoc._id },
		String(process.env.AUTH_TOKEN_SECRET),
		{ expiresIn: "7d" }
	);

	await sendPasswordChangedConfirmation({ userEmail: email });

	return new NextResponse(
		JSON.stringify({ success: true, message: "Password changed" }),
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
