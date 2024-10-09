import { sendEmailVerificationCode } from "@/lib/emails";
import { connectDB } from "@/lib/mongodb";
import User, { UserDocument } from "@/models/User";
import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	await connectDB();

	interface Body {
		email: string;
	}

	const body: Body = await request.json();

	const email = decodeURIComponent(body.email);

	const userDoc: HydratedDocument<UserDocument> | null = await User.findOne({
		email,
	});

	if (!userDoc) {
		return NextResponse.json({
			success: false,
			message: "Email unregistered",
		});
	}

	await sendEmailVerificationCode({
		userId: userDoc._id,
		userEmail: userDoc.email,
	});

	return NextResponse.json(
		{ success: true, message: "Code sent" },
		{ status: 200 }
	);
}
