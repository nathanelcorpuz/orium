import { authOptions } from "@/lib/auth";
import { SessionType } from "@/lib/types";
import Balance from "@/models/Balance";
import Extra from "@/models/Extra";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function del(request: NextRequest) {
	const session: SessionType = await getServerSession(authOptions);

	if (!session) {
		return new Response("unauthorized");
	}

	const userId = session.user.id;

	const body = await request.json();

	await User.findByIdAndUpdate(userId, { $pull: { balanceIds: body._id } });

	await Balance.findByIdAndDelete(body._id);

	return new Response("success");
}
