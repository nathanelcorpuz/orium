import Extra from "@/models/Extra";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function get() {
	const { userId } = auth();

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const extras = await Extra.find({ userId });

	return NextResponse.json(extras);
}
