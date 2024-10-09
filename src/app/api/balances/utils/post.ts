import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import { NewBalance } from "@/lib/types";
import Balance from "@/models/Balance";

import { NextRequest, NextResponse } from "next/server";

export async function post(request: NextRequest) {
	await connectDB();

	const auth = await verifyToken();

	if (!auth.success) return NextResponse.json(auth);

	const newBalance: NewBalance = await request.json();
	await Balance.create({
		userId: auth.userId,
		name: newBalance.name,
		amount: newBalance.amount,
		comments: newBalance.comments || "",
	});

	return NextResponse.json({ success: true, message: "Balance created" });
}
