import { sendPasswordResetCode } from "@/lib/emails";
import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import User, { UserDocument } from "@/models/User";
import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
	try {
		await connectDB();
		const { email: undecodedEmail } = await request.json();

		const email = decodeURIComponent(undecodedEmail);

		const userDoc: HydratedDocument<UserDocument> | null = await User.findOne({
			email,
		});

		if (!userDoc) throw new Error("User not found");

		await sendPasswordResetCode({ userEmail: userDoc.email });

		return new NextResponse(JSON.stringify({ message: "Success" }));
	} catch (error) {
		return errorHandler(error as Error);
	}
}
