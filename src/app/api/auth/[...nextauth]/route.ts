import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

// reference: https://www.mongodb.com/developer/languages/typescript/nextauthjs-authentication-mongodb/#creating-the-next-js-project