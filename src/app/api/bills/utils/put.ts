import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import { Bill as BillType } from "@/lib/types";
import Bill from "@/models/Bill";
import Transaction, { TransactionDocument } from "@/models/Transaction";

import { addMonths, getMonth, getYear, isPast } from "date-fns";
import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function put(request: NextRequest) {
	await connectDB();
	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const newBill: BillType = await request.json();

	await Bill.findByIdAndUpdate(newBill._id, {
		name: newBill.name,
		amount: newBill.amount,
		day: newBill.day,
		comments: newBill.comments || "",
	});

	await Transaction.updateMany(
		{ typeId: newBill._id },
		{ name: newBill.name, amount: newBill.amount }
	);

	const transactions: HydratedDocument<TransactionDocument>[] =
		await Transaction.find({
			typeId: newBill._id,
		});

	const currentYear = getYear(new Date());
	const currentMonth = getMonth(new Date());
	let startDate = new Date(currentYear, currentMonth, newBill.day);
	if (isPast(startDate)) {
		startDate = addMonths(startDate, 1);
	}

	let currentDate = startDate;

	for (let index = 0; index < transactions.length; index++) {
		await transactions[index].updateOne({ dueDate: currentDate });

		const isFebOffsetNeeded = newBill.day > 28 && getMonth(currentDate) === 1;

		if (isFebOffsetNeeded) {
			currentDate = new Date(getYear(currentDate), 2, newBill.day);
		} else {
			currentDate = addMonths(currentDate, 1);
		}
	}

	return NextResponse.json({ success: true, message: "Bill updated" });
}
