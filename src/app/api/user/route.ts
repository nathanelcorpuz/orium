import { errorHandler } from "@/lib/error";
import User, { UserDocument } from "@/models/User";
import { HydratedDocument } from "mongoose";
import { verifyToken } from "@/lib/token";

export async function GET() {
	try {
		const decoded = await verifyToken();

		const userDoc: HydratedDocument<UserDocument> | null = await User.findById(
			decoded.userId
		);

		if (!userDoc) throw new Error("Security error");

		return new Response(
			JSON.stringify({
				email: userDoc.email,
				name: userDoc.name,
			})
		);
	} catch (error) {
		return errorHandler(error as Error);
	}
}
