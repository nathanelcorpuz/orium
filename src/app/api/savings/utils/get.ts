import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Savings from "@/models/Savings";

import { NextResponse } from "next/server";

export async function get() {
	await connectDB();
	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const savings = await Savings.find({ userId: auth.userId });

	return NextResponse.json(savings);
}
