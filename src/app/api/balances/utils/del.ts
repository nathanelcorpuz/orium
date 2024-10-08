import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Balance from "@/models/Balance";

import { NextRequest, NextResponse } from "next/server";

export async function del(request: NextRequest) {
	try {
		await connectDB();

		await verifyToken();

		const body = await request.json();

		await Balance.findByIdAndDelete(body._id);

		return NextResponse.json({ message: "success" });
	} catch (error) {
		return errorHandler(error as Error);
	}
}
