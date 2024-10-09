import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import { NewBill, NewTransaction } from "@/lib/types";
import Bill, { BillDocument } from "@/models/Bill";
import Transaction from "@/models/Transaction";
import {
	addMonths,
	differenceInCalendarMonths,
	getMonth,
	getYear,
	isPast,
} from "date-fns";
import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function post(request: NextRequest) {
	await connectDB();
	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const newBill: NewBill = await request.json();
	const newBillDoc: HydratedDocument<BillDocument> = await Bill.create({
		userId: auth.userId,
		name: newBill.name,
		amount: newBill.amount,
		day: newBill.day,
		comments: newBill.comments || "",
	});

	const currentYear = getYear(new Date());
	const currentMonth = getMonth(new Date());

	let startDate = new Date(currentYear, currentMonth, newBill.day);

	if (isPast(startDate)) {
		startDate = addMonths(startDate, 1);
	}

	const instances = differenceInCalendarMonths(newBill.endDate, startDate) + 1;

	let currentDate = startDate;

	for (let index = 0; index < instances; index++) {
		const newTransaction: NewTransaction = {
			userId: auth.userId,
			name: newBill.name,
			amount: newBill.amount,
			dueDate: currentDate,
			type: "bill",
			typeId: newBillDoc._id,
		};

		await Transaction.create(newTransaction);

		const isFebOffsetNeeded = newBill.day > 28 && getMonth(currentDate) === 1;

		if (isFebOffsetNeeded) {
			currentDate = new Date(getYear(currentDate), 2, newBill.day);
		} else {
			currentDate = addMonths(currentDate, 1);
		}
	}

	return NextResponse.json({ success: true, message: "Bill created" });
}
