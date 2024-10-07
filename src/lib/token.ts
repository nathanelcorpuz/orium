import User from "@/models/User";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function verifyToken() {
	const cookieStore = cookies();
	const token = cookieStore.get("token");

	if (!token) throw new Error("Account error");

	const decoded = jwt.verify(
		String(token.value),
		String(process.env.AUTH_TOKEN_SECRET)
	);

	if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
		throw new Error("Unauthorized");
	}

	const userDoc = await User.findById(decoded.userId);

	if (!userDoc) throw new Error("Account error");

	if (userDoc.isLocked)
		throw new Error(
			"Account locked, please reach out to oriumsupport@gmail.com"
		);

	return decoded;
}
