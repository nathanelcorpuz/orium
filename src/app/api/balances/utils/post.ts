import { authOptions } from "@/lib/auth";
import { NewBalance, SessionType } from "@/lib/types";
import Balance, { BalanceDocument } from "@/models/Balance";
import User from "@/models/User";
import { HydratedDocument } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function post(request: NextRequest) {
	const session: SessionType = await getServerSession(authOptions);

	if (!session) {
		return new Response("unauthorized");
	}

	const userId = session.user.id;

	const newBalance: NewBalance = await request.json();
	const newBalanceDoc: HydratedDocument<BalanceDocument> = await Balance.create(
		{
			userId,
			name: newBalance.name,
			amount: newBalance.amount,
		}
	);

	await User.findByIdAndUpdate(userId, {
		$push: { balanceIds: newBalanceDoc._id },
	});

	return new Response("Success");
}
