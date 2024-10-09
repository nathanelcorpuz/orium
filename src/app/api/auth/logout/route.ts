import { connectDB } from "@/lib/mongodb";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
	await connectDB();

	const cookieStore = cookies();
	cookieStore.delete("token");
	return NextResponse.json({ success: true, message: "Log out success" });
}
