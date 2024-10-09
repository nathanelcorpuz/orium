import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Transaction, { TransactionDocument } from "@/models/Transaction";
import { isPast, isToday } from "date-fns";

import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	await connectDB();

	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const transactions: HydratedDocument<TransactionDocument>[] =
		await Transaction.find({ userId: auth.userId }).sort({ dueDate: 1 });

	return NextResponse.json(transactions);
}

export async function PUT(request: NextRequest) {
	await connectDB();

	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	interface Body {
		transactionId: string;
		newDate: Date;
		newAmount: number;
		newName: string;
	}

	const { transactionId, newDate, newName, newAmount }: Body =
		await request.json();

	if (isPast(newDate) && !isToday(newDate)) {
		return NextResponse.json({
			success: false,
			message: "Date is past, move to history instead.",
		});
	}

	await Transaction.findByIdAndUpdate(transactionId, {
		dueDate: newDate,
		name: newName,
		amount: newAmount,
	});

	return NextResponse.json({ success: true, message: "Transaction updated" });
}
