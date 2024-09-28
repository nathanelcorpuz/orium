import { authOptions } from "@/lib/auth";
import { NewExtra, NewTransaction, SessionType } from "@/lib/types";
import Extra, { ExtraDocument } from "@/models/Extra";
import Transaction from "@/models/Transaction";
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

	const newExtra: NewExtra = await request.json();
	const newExtraDoc: HydratedDocument<ExtraDocument> = await Extra.create({
		userId,
		name: newExtra.name,
		amount: newExtra.amount,
		date: newExtra.date,
		comments: newExtra.comments || "",
	});

	await User.findByIdAndUpdate(userId, {
		$push: { extraIds: newExtraDoc._id },
	});

	const newTransaction: NewTransaction = {
		userId,
		name: newExtra.name,
		amount: newExtra.amount,
		dueDate: newExtra.date,
		type: "extra",
		typeId: newExtraDoc._id,
	};

	const newTransactionDoc = await Transaction.create(newTransaction);

	await newExtraDoc.updateOne({ transactionId: newTransactionDoc._id });

	await User.findByIdAndUpdate(userId, {
		transactionId: newTransactionDoc._id,
	});

	return new Response("Success");
}
