import { authOptions } from "@/lib/auth";
import { NewSavings, NewTransaction, SessionType } from "@/lib/types";
import Savings, { SavingsDocument } from "@/models/Savings";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import {
	addMonths,
	differenceInCalendarMonths,
	getMonth,
	getYear,
	isPast,
} from "date-fns";
import { HydratedDocument } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function post(request: NextRequest) {
	const session: SessionType = await getServerSession(authOptions);

	if (!session) {
		return new Response("unauthorized");
	}

	const userId = session.user.id;

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

	await User.findByIdAndUpdate(userId, {
		$push: { savingsIds: newSavingsDoc._id },
	});

	const transactionIds = [];
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

		const newTransactionDoc = await Transaction.create(newTransaction);

		transactionIds.push(newTransactionDoc._id);

		const isFebOffsetNeeded =
			newSavings.day > 28 && getMonth(currentDate) === 1;

		if (isFebOffsetNeeded) {
			currentDate = new Date(getYear(currentDate), 2, newSavings.day);
		} else {
			currentDate = addMonths(currentDate, 1);
		}
	}

	await newSavingsDoc.updateOne({ $push: { transactionIds } });

	await User.findByIdAndUpdate(userId, { $push: { transactionIds } });

	return new Response("Success");
}
