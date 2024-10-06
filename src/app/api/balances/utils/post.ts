import { errorHandler } from "@/lib/error";
import { NewBalance } from "@/lib/types";
import Balance from "@/models/Balance";

import { NextRequest } from "next/server";

export async function post(request: NextRequest) {
	try {

		const userId = "";

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
