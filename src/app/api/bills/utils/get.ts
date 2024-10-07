import { connectDB } from "@/lib/mongodb";
import Bill from "@/models/Bill";

import { NextResponse } from "next/server";

export async function get() {
	await connectDB();

	const userId = "";

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const bills = await Bill.find({ userId });

	return NextResponse.json(bills);
}
