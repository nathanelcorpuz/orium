import { errorHandler } from "@/lib/error";
import Balance from "@/models/Balance";

import { NextResponse } from "next/server";

export async function get() {
	try {
		const userId = "";

		const balances = await Balance.find({ userId });

		console.log("\n\n\n BALANCES:");
		console.log(balances);

		return NextResponse.json(balances);
	} catch (error) {
		return errorHandler(error as Error);
	}
}
