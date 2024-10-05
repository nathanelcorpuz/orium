import Balance from "@/models/Balance";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function get() {
	const { userId } = auth();

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const balances = await Balance.find({ userId });

	return NextResponse.json(balances);
}
