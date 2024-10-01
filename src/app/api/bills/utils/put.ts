import { authOptions } from "@/lib/auth";
import { Bill as BillType, SessionType } from "@/lib/types";
import Bill from "@/models/Bill";
import Transaction, { TransactionDocument } from "@/models/Transaction";
import { addMonths, getMonth, getYear, isPast } from "date-fns";
import { HydratedDocument } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function put(request: NextRequest) {
	const session: SessionType = await getServerSession(authOptions);

	if (!session) {
		return new Response("unauthorized");
	}

	const newBill: BillType = await request.json();

	const result = await Bill.findByIdAndUpdate(newBill._id, {
		name: newBill.name,
		amount: newBill.amount,
		day: newBill.day,
		comments: newBill.comments || "",
	});

	console.log(result);

	await Transaction.updateMany(
		{ typeId: newBill._id },
		{ name: newBill.name, amount: newBill.amount }
	);

	const transactions: HydratedDocument<TransactionDocument>[] =
		await Transaction.find({
			typeId: newBill._id,
		});

	const currentYear = getYear(new Date());
	const currentMonth = getMonth(new Date());
	let startDate = new Date(currentYear, currentMonth, newBill.day);
	if (isPast(startDate)) {
		console.log("is past");
		startDate = addMonths(startDate, 1);
	}

	let currentDate = startDate;

	for (let index = 0; index < transactions.length; index++) {
		await transactions[index].updateOne({ dueDate: currentDate });

		const isFebOffsetNeeded = newBill.day > 28 && getMonth(currentDate) === 1;

		if (isFebOffsetNeeded) {
			currentDate = new Date(getYear(currentDate), 2, newBill.day);
		} else {
			currentDate = addMonths(currentDate, 1);
		}
	}

	return new Response("Success");
}
