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
import { auth } from "@clerk/nextjs/server";

export async function post(request: NextRequest) {
	const { userId } = auth();

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const newBill: NewBill = await request.json();
	const newBillDoc: HydratedDocument<BillDocument> = await Bill.create({
		userId,
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
			userId,
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

	return new Response("Success");
}
