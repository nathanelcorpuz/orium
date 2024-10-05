import Extra from "@/models/Extra";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function del(request: NextRequest) {
	const { userId } = auth();

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body = await request.json();

	await Transaction.deleteMany({ typeId: body._id });

	await Extra.findByIdAndDelete(body._id);

	return new Response("success");
}
