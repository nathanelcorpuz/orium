import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import { Extra as ExtraType } from "@/lib/types";
import Extra from "@/models/Extra";
import Transaction from "@/models/Transaction";

import { NextRequest, NextResponse } from "next/server";

export async function put(request: NextRequest) {
	try {
		await connectDB();
		const { userId } = await verifyToken();

		if (!userId)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const newExtra: ExtraType = await request.json();

		await Extra.findByIdAndUpdate(newExtra._id, {
			name: newExtra.name,
			amount: newExtra.amount,
			date: newExtra.date,
			comments: newExtra.comments || "",
		});

		await Transaction.findOneAndUpdate(
			{ typeId: newExtra._id },
			{
				name: newExtra.name,
				amount: newExtra.amount,
				dueDate: newExtra.date,
				comments: newExtra.comments,
			}
		);

		return new Response("Success");
	} catch (error) {
		return errorHandler(error as Error);
	}
}
