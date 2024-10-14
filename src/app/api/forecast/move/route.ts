import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import { NewHistory } from "@/lib/types";
import History from "@/models/History";
import Transaction from "@/models/Transaction";
import { getDate, isFuture } from "date-fns";
import { toZonedTime } from "date-fns-tz";

import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
	await connectDB();
	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	interface Body {
		transactionId: string;
		newHistory: NewHistory;
	}

	const body: Body = await request.json();

	const newHistory: NewHistory = body.newHistory;

	if (
		isFuture(newHistory.actualDate) &&
		getDate(newHistory.actualDate) !==
			getDate(toZonedTime(new Date(), "Asia/Manila"))
	) {
		return NextResponse.json({
			success: false,
			message: "Date is in the future, submit edit instead",
		});
	}

	newHistory.userId = auth.userId;

	await History.create(newHistory);

	await Transaction.findByIdAndDelete(body.transactionId);

	return NextResponse.json({
		success: true,
		message: "Transaction moved to history",
	});
}
