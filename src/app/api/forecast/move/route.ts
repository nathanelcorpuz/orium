import { NewHistory } from "@/lib/types";
import History from "@/models/History";
import Transaction from "@/models/Transaction";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
	const { userId } = auth();

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	interface Body {
		transactionId: string;
		newHistory: NewHistory;
	}

	const body: Body = await request.json();

	const newHistory: NewHistory = body.newHistory;

	newHistory.userId = userId;

	await History.create(newHistory);

	await Transaction.findByIdAndDelete(body.transactionId);

	return new Response("success");
}
