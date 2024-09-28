import { authOptions } from "@/lib/auth";
import { SessionType } from "@/lib/types";
import Transaction, { TransactionDocument } from "@/models/Transaction";
import { HydratedDocument } from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
	const session: SessionType = await getServerSession(authOptions);

	if (!session) {
		return new Response("unauthorized");
	}

	const userId = session.user.id;

	const transactions: HydratedDocument<TransactionDocument>[] =
		await Transaction.find({ userId }).sort({dueDate: 1});

	return NextResponse.json(transactions);
}
