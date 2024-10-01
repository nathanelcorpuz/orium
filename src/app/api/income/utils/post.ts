import { authOptions } from "@/lib/auth";
import { NewIncome, NewTransaction, SessionType } from "@/lib/types";
import Income, { IncomeDocument } from "@/models/Income";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import {
	addMonths,
	addWeeks,
	getDay,
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

	const newIncome: NewIncome = await request.json();

	const newIncomeDoc: HydratedDocument<IncomeDocument> = await Income.create({
		userId,
		name: newIncome.name,
		amount: newIncome.amount,
		frequency: newIncome.frequency,
		day: newIncome.frequency !== "monthly" ? newIncome.day : null,
		comments: newIncome.comments || "",
	});

	await User.findByIdAndUpdate(userId, {
		$push: { incomeIds: newIncomeDoc._id },
	});

	const transactionIds = [];

	if (newIncome.frequency === "monthly") {
		const currentYear = getYear(new Date());
		const currentMonth = getMonth(new Date());

		let startDate = new Date(currentYear, currentMonth, newIncome.day);

		if (isPast(startDate)) {
			startDate = addMonths(startDate, 1);
		}

		let currentDate = startDate;

		for (let index = 0; index < newIncome.instances; index++) {
			const newTransaction: NewTransaction = {
				userId,
				name: newIncome.name,
				amount: newIncome.amount,
				dueDate: currentDate,
				type: "income",
				typeId: newIncomeDoc._id,
			};

			const newTransactionDoc = await Transaction.create(newTransaction);

			transactionIds.push(newTransactionDoc._id);

			const isFebOffsetNeeded =
				newIncome.day > 28 && getMonth(currentDate) === 1;

			if (isFebOffsetNeeded) {
				currentDate = new Date(getYear(currentDate), 2, newIncome.day);
			} else {
				currentDate = addMonths(currentDate, 1);
			}
		}

		await newIncomeDoc.updateOne({ $push: { transactionIds } });

		await User.findByIdAndUpdate(userId, { $push: { transactionIds } });
	} else {
		let currentDate = newIncome.startDate;
		for (let i = 0; i < newIncome.instances; i++) {
			const newTransaction: NewTransaction = {
				userId,
				name: newIncome.name,
				amount: newIncome.amount,
				dueDate: currentDate,
				type: "income",
				typeId: newIncomeDoc._id,
			};

			const newTransactionDoc = await Transaction.create(newTransaction);

			transactionIds.push(newTransactionDoc._id);
			currentDate = addWeeks(
				currentDate,
				newIncome.frequency === "bi-weekly" ? 2 : 1
			);
		}

		await newIncomeDoc.updateOne({
			$push: { transactionIds },
			dayOfWeek: getDay(newIncome.startDate),
		});

		await User.findByIdAndUpdate(userId, { $push: { transactionIds } });
	}

	return new Response("Success");
}
