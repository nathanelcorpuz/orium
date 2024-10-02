import { authOptions } from "@/lib/auth";
import { NewIncome, NewTransaction, SessionType } from "@/lib/types";
import Income, { IncomeDocument } from "@/models/Income";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import {
	addMonths,
	addWeeks,
	getDate,
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
	} else if (
		newIncome.frequency === "bi-weekly" ||
		newIncome.frequency === "weekly"
	) {
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
	} else if (newIncome.frequency === "15-30") {
		let currentDate = new Date(
			getYear(newIncome.startDate),
			getMonth(newIncome.startDate),
			15
		);

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

		await newIncomeDoc.updateOne({ $push: { transactionIds } });

		await User.findByIdAndUpdate(userId, { $push: { transactionIds } });
	}

	return new Response("Success");
}
