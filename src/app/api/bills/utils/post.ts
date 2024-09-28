import { authOptions } from "@/lib/auth";
import { NewBill, NewTransaction, SessionType } from "@/lib/types";
import Bill, { BillDocument } from "@/models/Bill";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import { addMonths, getMonth, getYear, isPast } from "date-fns";
import { HydratedDocument } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function post(request: NextRequest) {
	const session: SessionType = await getServerSession(authOptions);

	if (!session) {
		return new Response("unauthorized");
	}

	const userId = session.user.id;

	const newBill: NewBill = await request.json();
	const newBillDoc: HydratedDocument<BillDocument> = await Bill.create({
		userId,
		name: newBill.name,
		amount: newBill.amount,
		day: newBill.day,
		comments: newBill.comments || "",
	});

	await User.findByIdAndUpdate(userId, { $push: { billIds: newBillDoc._id } });

	const transactionIds = [];
	const currentYear = getYear(new Date());
	const currentMonth = getMonth(new Date());
	let startDate = new Date(currentYear, currentMonth, newBill.day);
	if (isPast(startDate)) {
		startDate = addMonths(startDate, 1);
	}

	let currentDate = startDate;

	for (let index = 0; index < newBill.instances; index++) {
		const newTransaction: NewTransaction = {
			userId,
			name: newBill.name,
			amount: newBill.amount,
			dueDate: currentDate,
			type: "bill",
			typeId: newBillDoc._id,
		};

		const newTransactionDoc = await Transaction.create(newTransaction);

		transactionIds.push(newTransactionDoc._id);

		const isFebOffsetNeeded = newBill.day > 28 && getMonth(currentDate) === 1;

		if (isFebOffsetNeeded) {
			currentDate = new Date(getYear(currentDate), 2, newBill.day);
		} else {
			currentDate = addMonths(currentDate, 1);
		}
	}

	await newBillDoc.updateOne({ $push: { transactionIds } });

	await User.findByIdAndUpdate(userId, { $push: { transactionIds } });

	return new Response("Success");
}
