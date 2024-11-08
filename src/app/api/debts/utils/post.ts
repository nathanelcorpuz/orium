import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import { NewDebt, NewTransaction } from "@/lib/types";
import Debt, { DebtDocument } from "@/models/Debt";
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

	const newDebt: NewDebt = await request.json();

	const year = getYear(newDebt.startDate);
	const month = getMonth(newDebt.startDate);
	let startDate = new Date(year, month, newDebt.day);
	const endDate = new Date(
		getYear(newDebt.endDate),
		getMonth(newDebt.endDate),
		newDebt.day
	);

	if (isPast(startDate)) {
		startDate = addMonths(startDate, 1);
	}

	let instances = differenceInCalendarMonths(endDate, startDate) + 1;

	if (startDate === endDate) instances = 1;

	const newDebtDoc: HydratedDocument<DebtDocument> = await Debt.create({
		userId: auth.userId,
		name: newDebt.name,
		amount: newDebt.amount,
		day: newDebt.day,
		startDate: new Date(
			getYear(newDebt.startDate),
			getMonth(newDebt.startDate),
			newDebt.day
		),
		endDate: new Date(
			getYear(newDebt.endDate),
			getMonth(newDebt.endDate),
			newDebt.day
		),
		comments: newDebt.comments || "",
	});

	let currentDate = startDate;

	for (let index = 0; index < instances; index++) {
		const newTransaction: NewTransaction = {
			userId: auth.userId,
			name: newDebt.name,
			amount: newDebt.amount,
			dueDate: currentDate,
			type: "debt",
			typeId: newDebtDoc._id,
		};

		await Transaction.create(newTransaction);

		const isFebOffsetNeeded = newDebt.day > 28 && getMonth(currentDate) === 1;

		if (isFebOffsetNeeded) {
			currentDate = new Date(getYear(currentDate), 2, newDebt.day);
		} else {
			currentDate = addMonths(currentDate, 1);
		}
	}

	return NextResponse.json({ success: true, message: "Debt created" });
}
