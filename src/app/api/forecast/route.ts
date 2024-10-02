import { authOptions } from "@/lib/auth";
import { SessionType, Transaction as TransactionType } from "@/lib/types";
import Bill from "@/models/Bill";
import Transaction, { TransactionDocument } from "@/models/Transaction";
import { getDate } from "date-fns";
import { HydratedDocument } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	const session: SessionType = await getServerSession(authOptions);

	if (!session) {
		return new Response("unauthorized");
	}

	const userId = session.user.id;

	const transactions: HydratedDocument<TransactionDocument>[] =
		await Transaction.find({ userId }).sort({ dueDate: 1 });

	return NextResponse.json(transactions);
}

export async function PUT(request: NextRequest) {
	const session: SessionType = await getServerSession(authOptions);

	if (!session) {
		return new Response("unauthorized");
	}

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
