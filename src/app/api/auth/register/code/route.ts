import { sendEmailVerificationCode } from "@/lib/emails";
import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import User, { UserDocument } from "@/models/User";
import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		await connectDB();

		interface Body {
			email: string;
		}

		const body: Body = await request.json();

		const email = decodeURIComponent(body.email);

		const userDoc: HydratedDocument<UserDocument> | null = await User.findOne({
			email,
		});

		if (!userDoc) throw new Error("Email unregistered");

		await sendEmailVerificationCode({
			userId: userDoc._id,
			userEmail: userDoc.email,
		});

		return NextResponse.json({ message: "Success" }, { status: 200 });
	} catch (error) {
		return errorHandler(error as Error);
	}
}
