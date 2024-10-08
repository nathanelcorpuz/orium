import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Balance from "@/models/Balance";

import { NextResponse } from "next/server";

export async function get() {
	try {
		await connectDB();

		const { userId } = await verifyToken();

		const balances = await Balance.find({ userId });

		return NextResponse.json(balances);
	} catch (error) {
		return errorHandler(error as Error);
	}
}
