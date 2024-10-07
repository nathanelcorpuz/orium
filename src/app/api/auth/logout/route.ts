import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
	try {
		await connectDB();

		const cookieStore = cookies();
		cookieStore.delete("token");
		return NextResponse.json({ success: true });
	} catch (error) {
		return errorHandler(error as Error);
	}
}
