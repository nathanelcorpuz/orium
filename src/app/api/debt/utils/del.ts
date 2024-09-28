import { authOptions } from "@/lib/auth";
import { SessionType, Transaction as TransactionType } from "@/lib/types";
import Debt from "@/models/Debt";
import Transaction from "@/models/Transaction";
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

	const transactions: TransactionType[] = await Transaction.find({
		typeId: body._id,
	});

	const transactionIds = transactions.map((transaction) => transaction._id);

	await User.findByIdAndUpdate(userId, {
		$pull: {
			transactionIds: { $in: transactionIds },
			debtIds: body._id,
		},
	});

	await Transaction.deleteMany({ typeId: body._id });

	await Debt.findByIdAndDelete(body._id);

	return new Response("success");
}
