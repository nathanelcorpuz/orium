import { NewIncome, NewTransaction } from "@/lib/types";
import Income, { IncomeDocument } from "@/models/Income";
import Transaction from "@/models/Transaction";

import {
	addMonths,
	addWeeks,
	differenceInCalendarMonths,
	getDate,
	getDay,
	getMonth,
	getYear,
	isPast,
} from "date-fns";
import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function post(request: NextRequest) {
	

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const newIncome: NewIncome = await request.json();

	const newIncomeDoc: HydratedDocument<IncomeDocument> = await Income.create({
		userId,
		name: newIncome.name,
		amount: newIncome.amount,
		frequency: newIncome.frequency,
		day: newIncome.frequency !== "monthly" ? newIncome.day : null,
		comments: newIncome.comments || "",
	});

	let startDate = new Date(
		getYear(new Date()),
		getMonth(new Date()),
		newIncome.day
	);

	if (isPast(startDate)) {
		startDate = addMonths(startDate, 1);
	}

	const instances =
		differenceInCalendarMonths(newIncome.endDate, startDate) + 1;

	if (newIncome.frequency === "monthly") {
		let currentDate = startDate;

		for (let index = 0; index < instances; index++) {
			const newTransaction: NewTransaction = {
				userId,
				name: newIncome.name,
				amount: newIncome.amount,
				dueDate: currentDate,
				type: "income",
				typeId: newIncomeDoc._id,
			};

			await Transaction.create(newTransaction);

			const isFebOffsetNeeded =
				newIncome.day > 28 && getMonth(currentDate) === 1;

			if (isFebOffsetNeeded) {
				currentDate = new Date(getYear(currentDate), 2, newIncome.day);
			} else {
				currentDate = addMonths(currentDate, 1);
			}
		}
	} else if (
		newIncome.frequency === "bi-weekly" ||
		newIncome.frequency === "weekly"
	) {
		let currentDate = newIncome.startDate;
		for (let i = 0; i < instances; i++) {
			const newTransaction: NewTransaction = {
				userId,
				name: newIncome.name,
				amount: newIncome.amount,
				dueDate: currentDate,
				type: "income",
				typeId: newIncomeDoc._id,
			};

			await Transaction.create(newTransaction);

			currentDate = addWeeks(
				currentDate,
				newIncome.frequency === "bi-weekly" ? 2 : 1
			);
		}

		await newIncomeDoc.updateOne({
			dayOfWeek: getDay(newIncome.startDate),
		});
	} else if (newIncome.frequency === "15-30") {
		const startDate15_30 = new Date(
			getYear(startDate),
			getMonth(startDate),
			15
		);

		const instances15_30 =
			differenceInCalendarMonths(newIncome.endDate, startDate15_30) + 1;

		let currentDate = startDate15_30;

		for (let index = 0; index < instances15_30; index++) {
			const newTransaction: NewTransaction = {
				userId,
				name: newIncome.name,
				amount: newIncome.amount,
				dueDate: currentDate,
				type: "income",
				typeId: newIncomeDoc._id,
			};

			await Transaction.create(newTransaction);

			//feb offset
			if (getDate(currentDate) === 15 && getMonth(currentDate) !== 1) {
				currentDate = new Date(getYear(currentDate), getMonth(currentDate), 30);
			} else if (getDate(currentDate) === 30) {
				currentDate = addMonths(currentDate, 1);
				currentDate = new Date(getYear(currentDate), getMonth(currentDate), 15);
			} else if (getDate(currentDate) === 15 && getMonth(currentDate) === 1) {
				currentDate = new Date(getYear(currentDate), 1, 28);
			} else if (getDate(currentDate) === 28 && getMonth(currentDate) === 1) {
				currentDate = addMonths(currentDate, 1);
				currentDate = new Date(getYear(currentDate), getMonth(currentDate), 15);
			}
		}
	}

	return new Response("Success");
}
