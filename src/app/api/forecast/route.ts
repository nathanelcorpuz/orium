import { authOptions } from "@/lib/auth";
import { SessionType } from "@/lib/types";
import Transaction, { TransactionDocument } from "@/models/Transaction";
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

	const body: Body = await request.json();

	await Transaction.findByIdAndUpdate(body.transactionId, {
		dueDate: body.newDate,
		name: body.newName,
		amount: body.newAmount,
	});

	return new Response("success");
}
