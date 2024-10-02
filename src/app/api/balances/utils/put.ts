import { authOptions } from "@/lib/auth";
import { NewBalance, SessionType } from "@/lib/types";
import Balance from "@/models/Balance";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function put(request: NextRequest) {
	const session: SessionType = await getServerSession(authOptions);

	if (!session) {
		return new Response("unauthorized");
	}

	interface NewBalanceToEdit extends NewBalance {
		_id: string;
	}

	const newBalance: NewBalanceToEdit = await request.json();

	await Balance.findByIdAndUpdate(newBalance._id, {
		name: newBalance.name,
		amount: newBalance.amount,
		comments: newBalance.comments || "",
	});

	return new Response("Success");
}
