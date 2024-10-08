import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Income from "@/models/Income";

import { NextResponse } from "next/server";

export async function get() {
	try {
		await connectDB();

		const { userId } = await verifyToken();

		if (!userId)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const income = await Income.find({ userId });

		return NextResponse.json(income);
	} catch (error) {
		return errorHandler(error as Error);
	}
}
