import { NewBalance } from "@/lib/types";
import Balance from "@/models/Balance";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function post(request: NextRequest) {
	const { userId } = auth();

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const newBalance: NewBalance = await request.json();
	await Balance.create({
		userId,
		name: newBalance.name,
		amount: newBalance.amount,
		comments: newBalance.comments || "",
	});

	return new Response("Success");
}
