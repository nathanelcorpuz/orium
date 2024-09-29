import { authOptions } from "@/lib/auth";
import { SessionType } from "@/lib/types";
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
		newDate: Date;
	}

	const body: Body = await request.json();

	await Transaction.findByIdAndUpdate(body.transactionId, {
		dueDate: body.newDate,
	});

	return new Response("success");
}
