import { connectDB } from "@/lib/mongodb";
import Debt from "@/models/Debt";

import { NextResponse } from "next/server";

export async function get() {
	await connectDB();

	const userId = "";

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const debt = await Debt.find({ userId });

	return NextResponse.json(debt);
}
