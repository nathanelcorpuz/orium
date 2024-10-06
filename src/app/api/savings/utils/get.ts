import Savings from "@/models/Savings";

import { NextResponse } from "next/server";

export async function get() {
	

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const savings = await Savings.find({ userId });

	return NextResponse.json(savings);
}
