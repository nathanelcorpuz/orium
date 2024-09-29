import { authOptions } from "@/lib/auth";
import { NewHistory, SessionType } from "@/lib/types";
import History from "@/models/History";
import Transaction from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
	const session: SessionType = await getServerSession(authOptions);

	if (!session) {
		return new Response("unauthorized");
	}

	interface Body {
		transactionId: string;
		newHistory: NewHistory;
	}

	const body: Body = await request.json();

	const newHistory: NewHistory = body.newHistory;

	await History.create(newHistory);

	await Transaction.findByIdAndDelete(body.transactionId);

	return new Response("success");
}
