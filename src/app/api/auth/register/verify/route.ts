import jwt from "jsonwebtoken";
import { errorHandler } from "@/lib/error";
import User, { UserDocument } from "@/models/User";
import { addDays, differenceInMinutes } from "date-fns";
import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

const { AUTH_TOKEN_SECRET } = process.env;

export async function POST(request: NextRequest) {
	try {
		await connectDB();

		const { digits, email } = await request.json();

		const userDoc: HydratedDocument<UserDocument> | null = await User.findOne({
			email: decodeURIComponent(email),
		});

		if (!userDoc) throw new Error("No account found");

		if (userDoc.isVerified) throw new Error("Already verified");

		const docDigits = userDoc.code.slice(0, 6);

		if (Number(digits) !== Number(docDigits)) throw new Error("Invalid code");

		const docTimestamp = userDoc.code.slice(6);

		const isExpired = differenceInMinutes(new Date(), docTimestamp) > 5;

		if (isExpired) throw new Error("Code expired");

		const token = jwt.sign({ userId: userDoc._id }, String(AUTH_TOKEN_SECRET), {
			expiresIn: "7d",
		});

		await userDoc.updateOne({ isVerified: true });

		return new NextResponse(JSON.stringify({ message: "Success" }), {
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
