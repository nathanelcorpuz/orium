import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import User, { UserDocument } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { HydratedDocument } from "mongoose";
import { addDays } from "date-fns";

export async function POST(request: NextRequest) {
	try {
		await connectDB();
		interface Body {
			email: string;
			password: string;
		}

		const { email, password }: Body = await request.json();

		const userDoc: HydratedDocument<UserDocument> | null = await User.findOne({
			email,
		});

		if (!userDoc) throw new Error("Invalid credentials");

		if (userDoc.isLocked)
			throw new Error(
				"Account locked, please reach out to oriumsupport@gmail.com"
			);

		const isPasswordCorrect = await bcrypt.compare(password, userDoc.password);

		if (!isPasswordCorrect) throw new Error("Invalid credentials");

		const token = jwt.sign(
			{ userId: userDoc._id },
			String(process.env.AUTH_TOKEN_SECRET),
			{ expiresIn: "7d" }
		);

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
