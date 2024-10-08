import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Bill from "@/models/Bill";

import { NextResponse } from "next/server";

export async function get() {
	try {
		await connectDB();
		const { userId } = await verifyToken();

		if (!userId)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const bills = await Bill.find({ userId });

		return NextResponse.json(bills);
	} catch (error) {
		return errorHandler(error as Error);
	}
}
