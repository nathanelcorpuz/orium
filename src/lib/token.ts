import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function verifyToken() {
	const cookieStore = cookies();
	const token = cookieStore.get("token");

	if (!token) {
		return {
			success: false,
			message: "Account error",
		};
	}

	const decoded = jwt.verify(
		String(token.value),
		String(process.env.AUTH_TOKEN_SECRET)
	);

	if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
		return {
			success: false,
			message: "Unauthorized",
		};
	}

	const userDoc = await User.findById(decoded.userId);

	if (!userDoc) {
		return {
			success: false,
			message: "Account error",
		};
	}

	if (userDoc.isLocked) {
		return {
			success: false,
			message: "Account locked, please reach out to oriumsupport@gmail.com",
		};
	}

	return {
		success: true,
		userId: decoded.userId,
	};
}
