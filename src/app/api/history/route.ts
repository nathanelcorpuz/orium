import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import History from "@/models/History";

import { NextResponse } from "next/server";

export async function GET() {
	await connectDB();

	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const history = await History.find({ userId: auth.userId });

	return NextResponse.json(history);
}
