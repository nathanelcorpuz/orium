"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
	{
		href: "/",
		text: "Home",
	},
	{
		href: "/forecast",
		text: "Forecast",
	},
	{
		href: "/bills",
		text: "Bills",
	},
	{
		href: "/income",
		text: "Income",
	},
	{
		href: "/debt",
		text: "Debt",
	},
	{
		href: "/savings",
		text: "Savings",
	},
	{
		href: "/extra",
		text: "Extra",
	},
	{
		href: "/balances",
		text: "Balances",
	},
	{
		href: "/history",
		text: "History",
	},
];

export default function SideNav() {
	const router = useRouter();
	const { status } = useSession();
	const pathname = usePathname();

	if (status === "unauthenticated" || status === "loading") {
		return null;
	}

	const linkClass = "p-2 rounded w-40";

	return (
		<div className="p-2 flex">
			<div className="flex flex-col p-2 gap-2 bg-slate-50 rounded-xl">
				{links.map((link) => (
					<Link
						key={link.text}
						href={link.href}
						className={`${linkClass} ${
							link.href === pathname && "font-extrabold"
						}`}
					>
						{link.text}
					</Link>
				))}
				<button
					className="mt-auto flex p-2 text-red-600 font-bold"
					onClick={() => {
						signOut({ redirect: false }).then(() => {
							router.push("/");
						});
					}}
				>
					Sign Out
				</button>
			</div>
		</div>
	);
}
