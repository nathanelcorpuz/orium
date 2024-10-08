import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import History from "@/models/History";

import { NextResponse } from "next/server";

export async function GET() {
	try {
		await connectDB();

		const { userId } = await verifyToken();

		if (!userId)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const history = await History.find({ userId });

		return NextResponse.json(history);
	} catch (error) {
		return errorHandler(error as Error);
	}
}
