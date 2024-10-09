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

	const mutation = useMutation({
		mutationFn: () => fetch(`${url}/api/auth/logout`, { method: "DELETE" }),
		onSuccess: () => queryClient.clear(),
	});

	return (
		<header className="flex p-5 bg-white">
			{pathname.includes("auth") ? null : (
				<div className="flex flex-col">
					<div className="flex flex-col gap-4 h-[100%]">
						{links.map((link) => (
							<Link
								key={link.text}
								href={link.href}
								className={`w-40 px-10 py-3 rounded-full transition-all hover:bg-slate-100 ${
									link.href === pathname && "bg-slate-200 hover:bg-slate-200"
								}`}
							>
								{link.text}
							</Link>
						))}
						<div className="flex flex-col gap-4 mt-auto">
							<Link
								className={`w-40 px-10 py-3 rounded-full transition-all hover:bg-slate-100 ${
									pathname.includes("settings") && "bg-slate-200"
								}`}
								href="/settings"
							>
								Settings
							</Link>
							<p
								className="w-40 px-10 py-3 rounded-full transition-all hover:bg-slate-100 text-red-500 cursor-pointer"
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
