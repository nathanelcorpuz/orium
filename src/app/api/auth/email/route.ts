import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
	await connectDB();

	const auth = await verifyToken();

	if (!auth.success) {
		return NextResponse.json(auth);
	}

	const body = await request.json();

	const newEmailExists = await User.findOne({ email: body.email });

	if (newEmailExists)
		return NextResponse.json({
			success: false,
			message: "Email already registered",
		});

	await User.findByIdAndUpdate(auth.userId, { email: body.email });

	return NextResponse.json({ success: true, message: "Email updated" });
}
