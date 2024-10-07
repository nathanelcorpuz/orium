import { connectDB } from "@/lib/mongodb";
import History from "@/models/History";

import { NextResponse } from "next/server";

export async function GET() {
	await connectDB();

	const userId = "";

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const history = await History.find({ userId });

	return NextResponse.json(history);
}
