import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
	try {
		await connectDB();
		
		const decoded = await verifyToken();

		const body = await request.json();

		const newEmailExists = await User.findOne({ email: body.email });

		if (newEmailExists) throw new Error("Email already registered");

		await User.findByIdAndUpdate(decoded.userId, { email: body.email });

		return NextResponse.json({ message: "Success" });
	} catch (error) {
		return errorHandler(error as Error);
	}
}
