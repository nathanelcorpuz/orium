import { errorHandler } from "@/lib/errorHandler";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const { userId } = auth();
		if (userId) throw new Error("Account error");
		return NextResponse.json("success");
	} catch (error) {
		return errorHandler(error as Error);
	}
}
