import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Debt from "@/models/Debt";

import { NextResponse } from "next/server";

export async function get() {
	await connectDB();

	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const debt = await Debt.find({ userId: auth.userId });

	return NextResponse.json(debt);
}
