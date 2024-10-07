import { connectDB } from "@/lib/mongodb";
import Income from "@/models/Income";

import { NextResponse } from "next/server";

export async function get() {
	await connectDB();

	const userId = "";

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const income = await Income.find({ userId });

	return NextResponse.json(income);
}
