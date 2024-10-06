import { NewExtra, NewTransaction } from "@/lib/types";
import Extra, { ExtraDocument } from "@/models/Extra";
import Transaction from "@/models/Transaction";
import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";


export async function post(request: NextRequest) {
	

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const newExtra: NewExtra = await request.json();
	const newExtraDoc: HydratedDocument<ExtraDocument> = await Extra.create({
		userId,
		name: newExtra.name,
		amount: newExtra.amount,
		date: newExtra.date,
		comments: newExtra.comments || "",
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

	return new Response("Success");
}
