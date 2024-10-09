import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Bill from "@/models/Bill";

import { NextResponse } from "next/server";

export async function get() {
	await connectDB();
	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const bills = await Bill.find({ userId: auth.userId });

	return NextResponse.json(bills);
}
