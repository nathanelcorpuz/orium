import { connectDB } from "@/lib/mongodb";
import Extra from "@/models/Extra";

import { NextResponse } from "next/server";

export async function get() {
	await connectDB();

	const userId = "";
	
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const extras = await Extra.find({ userId });

	return NextResponse.json(extras);
}
