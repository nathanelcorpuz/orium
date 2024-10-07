"use client";

import url from "@/lib/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
	const pathname = usePathname();
	const queryClient = useQueryClient();

	const linkClass = "rounded w-40";

	const mutation = useMutation({
		mutationFn: () => fetch(`${url}/api/auth/logout`, { method: "DELETE" }),
		onSuccess: () => queryClient.clear(),
	});

	return (
		<header className="flex">
			{pathname.includes("auth") ? null : (
				<div className="flex flex-col bg-slate-200">
					<div className="flex flex-col gap-10 p-10 h-[100%] bg-white">
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
						<div className="flex flex-col gap-6 mt-auto">
							<Link
								className={`${linkClass} ${
									pathname.includes("settings") && "font-extrabold"
								}`}
								href="/settings"
							>
								Settings
							</Link>
							<p
								className="text-red-500 hover:cursor-pointer hover:opacity-[0.5] transition-all"
								onClick={async () => {
									mutation.mutate();
									router.push("/auth/login");
								}}
							>
								Log out
							</p>
						</div>
					</div>
				</div>
			)}
		</header>
	);
}
