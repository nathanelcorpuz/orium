import Bill from "@/models/Bill";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function get() {
	const { userId } = auth();

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const bills = await Bill.find({ userId });

	return NextResponse.json(bills);
}
