import Income from "@/models/Income";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function get() {
	const { userId } = auth();

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const income = await Income.find({ userId });

	return NextResponse.json(income);
}
