import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import { NewExtra, NewTransaction } from "@/lib/types";
import Extra, { ExtraDocument } from "@/models/Extra";
import Transaction from "@/models/Transaction";
import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function post(request: NextRequest) {
	await connectDB();
	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const newExtra: NewExtra = await request.json();
	const newExtraDoc: HydratedDocument<ExtraDocument> = await Extra.create({
		userId: auth.userId,
		name: newExtra.name,
		amount: newExtra.amount,
		date: newExtra.date,
		comments: newExtra.comments || "",
	});

	const newTransaction: NewTransaction = {
		userId: auth.userId,
		name: newExtra.name,
		amount: newExtra.amount,
		dueDate: newExtra.date,
		type: "extra",
		typeId: newExtraDoc._id,
	};

	const newTransactionDoc = await Transaction.create(newTransaction);

	await newExtraDoc.updateOne({ transactionId: newTransactionDoc._id });

	return NextResponse.json({ success: true, message: "Extra created" });
}
