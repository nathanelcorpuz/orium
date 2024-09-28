import { authOptions } from "@/lib/auth";
import { SessionType } from "@/lib/types";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
	const session: SessionType = await getServerSession(authOptions);

	if (!session) {
		return new Response("unauthorized");
	}

	const userId = session.user.id;

  const body = await request.json();
  
  // actual amount
  // actual due date
}
