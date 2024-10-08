import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Debt from "@/models/Debt";

import { NextResponse } from "next/server";

export async function get() {
	try {
		await connectDB();

		const { userId } = await verifyToken();

		if (!userId)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const debt = await Debt.find({ userId });

		return NextResponse.json(debt);
	} catch (error) {
		return errorHandler(error as Error);
	}
}
