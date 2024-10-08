import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Extra from "@/models/Extra";

import { NextResponse } from "next/server";

export async function get() {
	try {
		await connectDB();

		const { userId } = await verifyToken();

		if (!userId)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const extras = await Extra.find({ userId });

		return NextResponse.json(extras);
	} catch (error) {
		return errorHandler(error as Error);
	}
}
