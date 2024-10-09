import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
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
	setDate,
} from "date-fns";
import { HydratedDocument } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function post(request: NextRequest) {
	await connectDB();
	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const newIncome: NewIncome = await request.json();

	const newIncomeDoc: HydratedDocument<IncomeDocument> = await Income.create({
		userId: auth.userId,
		name: newIncome.name,
		amount: newIncome.amount,
		frequency: newIncome.frequency,
		day: newIncome.frequency === "monthly" ? newIncome.day : null,
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
				userId: auth.userId,
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
				userId: auth.userId,
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

		let endDate = newIncome.endDate;

		if (
			getMonth(newIncome.endDate) === getMonth(startDate15_30) &&
			getYear(newIncome.endDate) &&
			getYear(startDate15_30)
		) {
			endDate = setDate(endDate, 30);
		}
		let instances =
			(differenceInCalendarMonths(endDate, startDate15_30) + 1) * 2;

		if (instances === 0) instances = 2;

		let currentDate = startDate15_30;

		for (let index = 0; index < instances; index++) {
			const newTransaction: NewTransaction = {
				userId: auth.userId,
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

	return NextResponse.json({ success: true, message: "Income created" });
}
