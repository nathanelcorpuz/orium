import { authOptions } from "@/lib/auth";
import { Extra as ExtraType, SessionType } from "@/lib/types";
import Extra from "@/models/Extra";
import Transaction from "@/models/Transaction";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function put(request: NextRequest) {
	const session: SessionType = await getServerSession(authOptions);

	if (!session) {
		return new Response("unauthorized");
	}

	const newExtra: ExtraType = await request.json();

	await Extra.findByIdAndUpdate(newExtra._id, {
		name: newExtra.name,
		amount: newExtra.amount,
		date: newExtra.date,
		comments: newExtra.comments || "",
	});

	await Transaction.findOneAndUpdate(
		{ typeId: newExtra._id },
		{
			name: newExtra.name,
			amount: newExtra.amount,
			dueDate: newExtra.date,
			comments: newExtra.comments,
		}
	);

	return new Response("Success");
}
