import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import Debt from "@/models/Debt";
import Transaction from "@/models/Transaction";
import { NextRequest, NextResponse } from "next/server";

export async function del(request: NextRequest) {
	try {
		await connectDB();
		const { userId } = await verifyToken();

		if (!userId)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const body = await request.json();

		await Transaction.deleteMany({ typeId: body._id });

		await Debt.findByIdAndDelete(body._id);

		return new Response("success");
	} catch (error) {
		return errorHandler(error as Error);
	}
}
