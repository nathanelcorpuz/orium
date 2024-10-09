import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Income from "@/models/Income";

import { NextResponse } from "next/server";

export async function get() {
	await connectDB();

	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const income = await Income.find({ userId: auth.userId });

	return NextResponse.json(income);
}
