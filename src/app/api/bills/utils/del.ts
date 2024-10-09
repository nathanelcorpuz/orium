import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Bill from "@/models/Bill";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";

export async function del(request: NextRequest) {
	await connectDB();
	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const body = await request.json();

	await Transaction.deleteMany({ typeId: body._id });

	await Bill.findByIdAndDelete(body._id);

	return NextResponse.json({ success: true, message: "Bill deleted" });
}
