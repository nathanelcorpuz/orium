import { authOptions } from "@/lib/auth";
import { SessionType } from "@/lib/types";
import History from "@/models/History";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
	const session: SessionType = await getServerSession(authOptions);

	if (!session) {
		return new Response("unauthorized");
	}

	const userId = session.user.id;

	const history = await History.find({ userId });

	return NextResponse.json(history);
}
