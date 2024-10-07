import { connectDB } from "@/lib/mongodb";
import Transaction, { TransactionDocument } from "@/models/Transaction";

import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	await connectDB();

	const userId = "";

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const transactions: HydratedDocument<TransactionDocument>[] =
		await Transaction.find({ userId }).sort({ dueDate: 1 });

	return NextResponse.json(transactions);
}

export async function PUT(request: NextRequest) {
	const userId = "";

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	interface Body {
		transactionId: string;
		newDate: Date;
		newAmount: number;
		newName: string;
	}

	const { transactionId, newDate, newName, newAmount }: Body =
		await request.json();

	await Transaction.findByIdAndUpdate(transactionId, {
		dueDate: newDate,
		name: newName,
		amount: newAmount,
	});

	return new Response("success");
}
