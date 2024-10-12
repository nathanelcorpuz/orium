import { sendMessage } from "@/lib/emails";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	await connectDB();
	const auth = await verifyToken();
	if (!auth.success) {
		return NextResponse.json({ success: false, message: "Account error" });
	}

	const { message } = await request.json();

	await sendMessage({ message });

	return NextResponse.json({ success: true, message: "Message sent" });
}
