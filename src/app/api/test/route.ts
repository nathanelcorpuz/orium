import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
	const { userId } = auth();
	console.log(userId);

	if (userId) throw new Error("error message thrown");
	return NextResponse.json("success");
}
