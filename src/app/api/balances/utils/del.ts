import Balance from "@/models/Balance";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function del(request: NextRequest) {
	const { userId } = auth();

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const body = await request.json();

	await Balance.findByIdAndDelete(body._id);

	return new Response("success");
}
