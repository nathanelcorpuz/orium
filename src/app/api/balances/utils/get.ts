import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Balance from "@/models/Balance";

import { NextResponse } from "next/server";

export async function get() {
	await connectDB();

	const auth = await verifyToken();

	if (!auth.success) return NextResponse.json(auth);

	const balances = await Balance.find({ userId: auth.userId });

	return NextResponse.json(balances);
}
