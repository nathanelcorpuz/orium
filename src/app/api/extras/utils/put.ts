import { Extra as ExtraType } from "@/lib/types";
import Extra from "@/models/Extra";
import Transaction from "@/models/Transaction";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function put(request: NextRequest) {
	const { userId } = auth();

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const newExtra: ExtraType = await request.json();

	await Extra.findByIdAndUpdate(newExtra._id, {
		name: newExtra.name,
		amount: newExtra.amount,
		date: newExtra.date,
		comments: newExtra.comments || "",
	});

	await Transaction.findOneAndUpdate(
		{ typeId: newExtra._id },
		{
			name: newExtra.name,
			amount: newExtra.amount,
			dueDate: newExtra.date,
			comments: newExtra.comments,
		}
	);

	return new Response("Success");
}
