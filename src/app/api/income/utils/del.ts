import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Income from "@/models/Income";
import Transaction from "@/models/Transaction";

import { NextRequest, NextResponse } from "next/server";

export async function del(request: NextRequest) {
	await connectDB();
	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const body = await request.json();

	await Transaction.deleteMany({ typeId: body._id });

	await Income.findByIdAndDelete(body._id);

	return NextResponse.json({ success: true, message: "Income deleted" });
}
