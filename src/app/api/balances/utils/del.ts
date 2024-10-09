import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Balance from "@/models/Balance";

import { NextRequest, NextResponse } from "next/server";

export async function del(request: NextRequest) {
	await connectDB();

	const auth = await verifyToken();

	if (!auth.success) {
		return NextResponse.json(auth);
	}

	const body = await request.json();

	await Balance.findByIdAndDelete(body._id);

	return NextResponse.json({ success: true, message: "Balance deleted" });
}
