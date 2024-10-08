import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import { NewHistory } from "@/lib/types";
import History from "@/models/History";
import Transaction from "@/models/Transaction";
import { isFuture, isToday } from "date-fns";

import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
	try {
		await connectDB();
		const { userId } = await verifyToken();

		if (!userId)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		interface Body {
			transactionId: string;
			newHistory: NewHistory;
		}

		const body: Body = await request.json();

		const newHistory: NewHistory = body.newHistory;

		if (isToday(newHistory.actualDate) || isFuture(newHistory.actualDate))
			throw new Error("Date is in future, submit edit instead");

		newHistory.userId = userId;

		await History.create(newHistory);

		await Transaction.findByIdAndDelete(body.transactionId);

		return new Response("success");
	} catch (error) {
		return errorHandler(error as Error);
	}
}
