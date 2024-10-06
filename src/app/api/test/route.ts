import { errorHandler } from "@/lib/error";
import { verifyToken } from "@/lib/token";

import { NextResponse } from "next/server";

export async function GET() {
	try {
		await verifyToken();

		return NextResponse.json("success");
	} catch (error) {
		return errorHandler(error as Error);
	}
}
