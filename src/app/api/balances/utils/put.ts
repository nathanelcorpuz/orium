import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import { NewBalance } from "@/lib/types";
import Balance from "@/models/Balance";

import { NextRequest, NextResponse } from "next/server";

export async function put(request: NextRequest) {
	await connectDB();
	const auth = await verifyToken();

	if (!auth.success) return NextResponse.json(auth);

	interface NewBalanceToEdit extends NewBalance {
		_id: string;
	}

	const newBalance: NewBalanceToEdit = await request.json();

	await Balance.findByIdAndUpdate(newBalance._id, {
		name: newBalance.name,
		amount: newBalance.amount,
		comments: newBalance.comments || "",
	});

	return NextResponse.json({ success: true, message: "Balance updated" });
}
