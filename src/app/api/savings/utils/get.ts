import { connectDB } from "@/lib/mongodb";
import Savings from "@/models/Savings";

import { NextResponse } from "next/server";

export async function get() {
	await connectDB();

	const userId = "";

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const savings = await Savings.find({ userId });

	return NextResponse.json(savings);
}
