import { authOptions } from "@/lib/auth";
import { SessionType } from "@/lib/types";
import Extra from "@/models/Extra";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function get() {
	const session: SessionType = await getServerSession(authOptions);

	if (!session) {
		return new Response("unauthorized");
	}

	const userId = session.user.id;

	const extras = await Extra.find({ userId });

	return NextResponse.json(extras);
}
