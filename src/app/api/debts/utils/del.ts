import Debt from "@/models/Debt";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";

export async function del(request: NextRequest) {
	const userId = "";

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body = await request.json();

	await Transaction.deleteMany({ typeId: body._id });

	await Debt.findByIdAndDelete(body._id);

	return new Response("success");
}
