import { sendPasswordResetCode } from "@/lib/emails";
import { connectDB } from "@/lib/mongodb";
import User, { UserDocument } from "@/models/User";
import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
	await connectDB();
	const { email: undecodedEmail } = await request.json();

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

	await sendPasswordResetCode({ userEmail: userDoc.email });

	return NextResponse.json({ success: true, message: "Code sent" });
}
