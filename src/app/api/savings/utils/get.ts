import Savings from "@/models/Savings";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function get() {
	const { userId } = auth();

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const savings = await Savings.find({ userId });

	return NextResponse.json(savings);
}
