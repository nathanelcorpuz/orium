import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Savings from "@/models/Savings";
import Transaction from "@/models/Transaction";

import { NextRequest, NextResponse } from "next/server";

export async function del(request: NextRequest) {
	await connectDB();
	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const body = await request.json();

	await Transaction.deleteMany({ typeId: body._id });

	await Savings.findByIdAndDelete(body._id);

	return NextResponse.json({ success: true, message: "Savings deleted" });
}
