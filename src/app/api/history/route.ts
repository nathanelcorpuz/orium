import History from "@/models/History";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
	const { userId } = auth();

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const history = await History.find({ userId });

	return NextResponse.json(history);
}
