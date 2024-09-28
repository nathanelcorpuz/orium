export { default } from "next-auth/middleware";

export const config = {
	matcher: [
		"/balances",
		"/bills",
		"/debt",
		"/extra",
		"/forecast",
		"/history",
		"/savings",
	],
};
