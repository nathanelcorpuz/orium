import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { UserDocument } from "@/models/User";
import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { addDays, differenceInMinutes } from "date-fns";
import { errorHandler } from "@/lib/error";
import { sendPasswordChangedConfirmation } from "@/lib/emails";
import { connectDB } from "@/lib/mongodb";

export async function PUT(request: NextRequest) {
	try {
		await connectDB();

		const { newPassword, digits, email: undecodedEmail } = await request.json();

		const email = decodeURIComponent(undecodedEmail);

		const userDoc: HydratedDocument<UserDocument> | null = await User.findOne({
			email,
		});

		if (!userDoc) throw new Error("User not found");

		const docDigits = userDoc.code.slice(0, 6);

		if (Number(digits) !== Number(docDigits)) throw new Error("Invalid code");

		const docTimestamp = userDoc.code.slice(6);

		const isExpired = differenceInMinutes(new Date(), docTimestamp) > 5;

		if (isExpired) throw new Error("Code expired");

		const isOldPassword = await bcrypt.compare(newPassword, userDoc.password);

		if (isOldPassword)
			throw new Error("This is your current password, sign in instead.");

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

		return new NextResponse(JSON.stringify({ isSuccess: true }), {
			status: 200,
			headers: {
				"Set-Cookie": `token=${token}; Expires=${addDays(
					new Date(),
					7
				)}; Secure; HttpOnly; Path=/`,
			},
		});
	} catch (error) {
		return errorHandler(error as Error);
	}
}
