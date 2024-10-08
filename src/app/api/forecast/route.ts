import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Transaction, { TransactionDocument } from "@/models/Transaction";
import { isPast, isToday } from "date-fns";

import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	try {
		await connectDB();

		const { userId } = await verifyToken();

		if (!userId)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const transactions: HydratedDocument<TransactionDocument>[] =
			await Transaction.find({ userId }).sort({ dueDate: 1 });

		return NextResponse.json(transactions);
	} catch (error) {
		return errorHandler(error as Error);
	}
}

export async function PUT(request: NextRequest) {
	try {
		await connectDB();

		const { userId } = await verifyToken();

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

		if (isPast(newDate) && !isToday(newDate))
			throw new Error("Date is past, move to history instead.");

		await Transaction.findByIdAndUpdate(transactionId, {
			dueDate: newDate,
			name: newName,
			amount: newAmount,
		});

		return new Response("success");
	} catch (error) {
		return errorHandler(error as Error);
	}
}
