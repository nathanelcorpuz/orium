import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
	let cookie = request.cookies.get("token");
	if (!cookie)
		return NextResponse.redirect(new URL("/auth/login", request.url));
}

export const config = {
	matcher: [
		"/",
		"/forecast",
		"/bills",
		"/debt",
		"/extra",
		"/history",
		"/savings",
		"/income",
		"/settings/(.*)",
	],
};
