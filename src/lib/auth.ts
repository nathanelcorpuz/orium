import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
	secret: process.env.NEXTAUTH_SECRET,
	pages: {
		signIn: "/login",
		newUser: "/register",
	},
	providers: [
		credentials({
			name: "Credentials",
			id: "credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				await connectDB();
				const user = await User.findOne({
					email: credentials?.email,
				}).select("+password");

				if (!user) throw new Error("Wrong Email");

				const passwordMatch = await bcrypt.compare(
					credentials!.password,
					user.password
				);

				if (!passwordMatch) throw new Error("Wrong Password");
				return user;
			},
		}),
	],
	callbacks: {
		async session({ session }) {
			await connectDB();
			const sessionUser = await User.findOne({ email: session?.user?.email });

			// @ts-expect-error always available
			session.user.id = sessionUser._id.toString();

			return session;
		},
	},
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60,
	},
};
