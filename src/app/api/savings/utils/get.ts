import { authOptions } from "@/lib/auth";
import { SessionType } from "@/lib/types";
import Savings from "@/models/Savings";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function get() {
	const session: SessionType = await getServerSession(authOptions);

	if (!session) {
		return new Response("unauthorized");
	}

	const userId = session.user.id;

	const savings = await Savings.find({ userId });

	return NextResponse.json(savings);
}
