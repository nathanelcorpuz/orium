import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import { Extra as ExtraType } from "@/lib/types";
import Extra from "@/models/Extra";
import Transaction from "@/models/Transaction";

import { NextRequest, NextResponse } from "next/server";

export async function put(request: NextRequest) {
	await connectDB();
	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const newExtra: ExtraType = await request.json();

	await Extra.findByIdAndUpdate(newExtra._id, {
		name: newExtra.name,
		amount: newExtra.amount,
		date: newExtra.date,
		comments: newExtra.comments || "",
	});

	await Transaction.findOneAndUpdate(
		{ typeId: newExtra._id },
		{
			name: newExtra.name,
			amount: newExtra.amount,
			dueDate: newExtra.date,
			comments: newExtra.comments,
		}
	);

	return NextResponse.json({ success: true, message: "Extra updated" });
}
