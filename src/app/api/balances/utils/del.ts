import { errorHandler } from "@/lib/error";
import Balance from "@/models/Balance";

import { NextRequest, NextResponse } from "next/server";

export async function del(request: NextRequest) {
	try {
		
		const body = await request.json();

		await Balance.findByIdAndDelete(body._id);

		return new Response("success");
	} catch (error) {
		return errorHandler(error as Error);
	}
}
