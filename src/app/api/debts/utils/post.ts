import { authOptions } from "@/lib/auth";
import { NewDebt, NewTransaction, SessionType } from "@/lib/types";
import Debt, { DebtDocument } from "@/models/Debt";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import {
	addMonths,
	differenceInCalendarMonths,
	differenceInMonths,
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

	const newDebt: NewDebt = await request.json();

	const transactionIds = [];
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

	const instances = differenceInCalendarMonths(endDate, startDate) + 1;

	const newDebtDoc: HydratedDocument<DebtDocument> = await Debt.create({
		userId,
		name: newDebt.name,
		amount: newDebt.amount,
		day: newDebt.day,
		startDate,
		endDate,
		comments: newDebt.comments || "",
	});

	await User.findByIdAndUpdate(userId, {
		$push: { debtIds: newDebtDoc._id },
	});

	let currentDate = startDate;

	for (let index = 0; index < instances; index++) {
		const newTransaction: NewTransaction = {
			userId,
			name: newDebt.name,
			amount: newDebt.amount,
			dueDate: currentDate,
			type: "debt",
			typeId: newDebtDoc._id,
		};

		const newTransactionDoc = await Transaction.create(newTransaction);

		transactionIds.push(newTransactionDoc._id);

		const isFebOffsetNeeded = newDebt.day > 28 && getMonth(currentDate) === 1;

		if (isFebOffsetNeeded) {
			currentDate = new Date(getYear(currentDate), 2, newDebt.day);
		} else {
			currentDate = addMonths(currentDate, 1);
		}
	}

	await newDebtDoc.updateOne({ $push: { transactionIds } });

	await User.findByIdAndUpdate(userId, { $push: { transactionIds } });

	return new Response("Success");
}
