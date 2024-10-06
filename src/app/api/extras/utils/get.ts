import Extra from "@/models/Extra";

import { NextResponse } from "next/server";

export async function get() {
	

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const extras = await Extra.find({ userId });

	return NextResponse.json(extras);
}
