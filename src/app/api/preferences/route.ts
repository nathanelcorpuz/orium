import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Preferences from "@/models/Preferences";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	await connectDB();
	const auth = await verifyToken();
	if (!auth.success)
		return NextResponse.json({ success: false, message: "Account error" });

	const prefDoc = await Preferences.findOne({ userId: auth.userId });
	return NextResponse.json(prefDoc);
}

export async function PUT(request: NextRequest) {
	await connectDB();
	const auth = await verifyToken();
	if (!auth.success)
		return NextResponse.json({ success: false, message: "Account error" });

	const newPreferences = await request.json();

	await Preferences.findOneAndUpdate(
		{ userId: auth.userId },
		{ ...newPreferences }
	);

	return NextResponse.json({ success: true, message: "Preferences updated" });
}
