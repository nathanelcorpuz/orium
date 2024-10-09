import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Extra from "@/models/Extra";

import { NextResponse } from "next/server";

export async function get() {
	await connectDB();

	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const extras = await Extra.find({ userId: auth.userId });

	return NextResponse.json(extras);
}
