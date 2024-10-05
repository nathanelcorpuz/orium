import { NewBalance } from "@/lib/types";
import Balance from "@/models/Balance";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function put(request: NextRequest) {
	const { userId } = auth();

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	interface NewBalanceToEdit extends NewBalance {
		_id: string;
	}

	const newBalance: NewBalanceToEdit = await request.json();

	await Balance.findByIdAndUpdate(newBalance._id, {
		name: newBalance.name,
		amount: newBalance.amount,
		comments: newBalance.comments || "",
	});

	return new Response("Success");
}
