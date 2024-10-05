"use client";

import {
	SignedIn,
	SignedOut,
	SignInButton,
	useAuth,
	UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
	const { isSignedIn } = useAuth();
	const pathname = usePathname();

	const linkClass = "p-2 rounded w-40";

	return (
		<div className="p-2 flex">
			<div className="flex flex-col p-2 gap-2 bg-slate-50 rounded-xl">
				<div className="pt-4 pl-2">
					<SignedOut>
						<SignInButton />
					</SignedOut>
					<SignedIn>
						<UserButton />
					</SignedIn>
				</div>
				{isSignedIn &&
					links.map((link) => (
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
			</div>
		</div>
	);
}
