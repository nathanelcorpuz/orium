import { NewSavings, NewTransaction } from "@/lib/types";
import Savings, { SavingsDocument } from "@/models/Savings";
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
	

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const newSavings: NewSavings = await request.json();

	const newSavingsDoc: HydratedDocument<SavingsDocument> = await Savings.create(
		{
			userId,
			name: newSavings.name,
			amount: newSavings.amount,
			day: newSavings.day,
			startDate: new Date(
				getYear(newSavings.startDate),
				getMonth(newSavings.startDate),
				newSavings.day
			),
			endDate: new Date(
				getYear(newSavings.endDate),
				getMonth(newSavings.endDate),
				newSavings.day
			),
			comments: newSavings.comments || "",
		}
	);

	const year = getYear(newSavings.startDate);
	const month = getMonth(newSavings.startDate);
	let startDate = new Date(year, month, newSavings.day);
	const endDate = new Date(
		getYear(newSavings.endDate),
		getMonth(newSavings.endDate),
		newSavings.day
	);

	if (isPast(startDate)) {
		startDate = addMonths(startDate, 1);
	}

	let instances = differenceInCalendarMonths(endDate, startDate) + 1;

	if (startDate === endDate) instances = 1;

	let currentDate = startDate;

	for (let index = 0; index < instances; index++) {
		const newTransaction: NewTransaction = {
			userId,
			name: newSavings.name,
			amount: newSavings.amount,
			dueDate: currentDate,
			type: "savings",
			typeId: newSavingsDoc._id,
		};

		await Transaction.create(newTransaction);

		const isFebOffsetNeeded =
			newSavings.day > 28 && getMonth(currentDate) === 1;

		if (isFebOffsetNeeded) {
			currentDate = new Date(getYear(currentDate), 2, newSavings.day);
		} else {
			currentDate = addMonths(currentDate, 1);
		}
	}

	return new Response("Success");
}
