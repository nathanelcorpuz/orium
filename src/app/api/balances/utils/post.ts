import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import { NewBalance } from "@/lib/types";
import Balance from "@/models/Balance";

import { NextRequest } from "next/server";

export async function post(request: NextRequest) {
	try {
		await connectDB();

		const { userId } = await verifyToken();

		const newBalance: NewBalance = await request.json();
		await Balance.create({
			userId,
			name: newBalance.name,
			amount: newBalance.amount,
			comments: newBalance.comments || "",
		});

		return new Response("Success");
	} catch (error) {
		return errorHandler(error as Error);
	}
}
