import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Savings from "@/models/Savings";

import { NextResponse } from "next/server";

export async function get() {
	try {
		await connectDB();

		const { userId } = await verifyToken();

		if (!userId)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const savings = await Savings.find({ userId });

		return NextResponse.json(savings);
	} catch (error) {
		return errorHandler(error as Error);
	}
}
