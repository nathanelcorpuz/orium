import Transaction, { TransactionDocument } from "@/models/Transaction";
import { auth } from "@clerk/nextjs/server";
import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	const { userId } = auth();

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const transactions: HydratedDocument<TransactionDocument>[] =
		await Transaction.find({ userId }).sort({ dueDate: 1 });

	return NextResponse.json(transactions);
}

export async function PUT(request: NextRequest) {
	const { userId } = auth();

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
