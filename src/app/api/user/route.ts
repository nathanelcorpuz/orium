import { errorHandler } from "@/lib/error";
import User, { UserDocument } from "@/models/User";
import { HydratedDocument } from "mongoose";
import { verifyToken } from "@/lib/token";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
	try {
		const decoded = await verifyToken();

		const userDoc: HydratedDocument<UserDocument> | null = await User.findById(
			decoded.userId
		);

		if (!userDoc) throw new Error("Account error");

		return new NextResponse(
			JSON.stringify({
				email: userDoc.email,
				name: userDoc.name,
			})
		);
	} catch (error) {
		return errorHandler(error as Error);
	}
}

export async function PUT(request: NextRequest) {
	try {
		const decoded = await verifyToken();

		const body = await request.json();

		await User.findByIdAndUpdate(decoded.userId, { name: body.name });

		return NextResponse.json({ message: "Success" });
	} catch (error) {
		return errorHandler(error as Error);
	}
}
