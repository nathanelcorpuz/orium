import User, { UserDocument } from "@/models/User";
import { HydratedDocument } from "mongoose";
import { verifyToken } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
	await connectDB();

	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const userDoc: HydratedDocument<UserDocument> | null = await User.findById(
		auth.userId
	);

	if (!userDoc) {
		return NextResponse.json({
			success: false,
			message: "Account error",
		});
	}

	return NextResponse.json({
		success: true,
		email: userDoc.email,
		name: userDoc.name,
	});
}

export async function PUT(request: NextRequest) {
	await connectDB();

	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const body = await request.json();

	await User.findByIdAndUpdate(auth.userId, { name: body.name });

	return NextResponse.json({ success: true, message: "User updated" });
}
