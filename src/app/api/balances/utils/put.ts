import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import { NewBalance } from "@/lib/types";
import Balance from "@/models/Balance";

import { NextRequest } from "next/server";

export async function put(request: NextRequest) {
	try {
		await connectDB();
		await verifyToken();

		interface NewBalanceToEdit extends NewBalance {
			_id: string;
		}

		const newBalance: NewBalanceToEdit = await request.json();

		await Balance.findByIdAndUpdate(newBalance._id, {
			name: newBalance.name,
			amount: newBalance.amount,
			comments: newBalance.comments || "",
		});

		return new Response("Success");
	} catch (error) {
		return errorHandler(error as Error);
	}
}
