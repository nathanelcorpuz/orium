"use client";

import url from "@/lib/url";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const mainLinks = [
	{
		href: "/",
		text: "Dashboard",
	},
	{
		href: "/forecast",
		text: "Forecast",
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

const transactionTypeLinks = [
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
];

export default function SideNav() {
	const router = useRouter();
	const pathname = usePathname();
	const queryClient = useQueryClient();

	interface UserAPIResult {
		success: boolean;
		name: string;
		email: string;
	}

	const { data } = useQuery({
		queryKey: ["user"],
		queryFn: () =>
			fetch(`${url}/api/user`).then(async (res) => {
				const result: UserAPIResult = await res.json();
				return result;
			}),
	});

	const mutation = useMutation({
		mutationFn: () => fetch(`${url}/api/auth/logout`, { method: "DELETE" }),
		onSuccess: () => queryClient.clear(),
	});

	return (
		data?.success && (
			<header className="flex py-10 pl-4 bg-white w-[300px]">
				{pathname.includes("auth") ? null : (
					<div className="flex flex-col">
						<div className="flex flex-col justify-between h-[100%]">
							<div className="flex flex-col gap-6">
								<div className="flex-col">
									<p className="text-xl font-extrabold uppercase px-3">Orium</p>
									<p className="text-sm text-slate-400 px-3">
										Finance Forecaster
									</p>
								</div>
								<div className="flex flex-col gap-2">
									{mainLinks.map((link) => (
										<Link
											key={link.text}
											href={link.href}
											className={`w-max px-3 py-1 text-slate-500 rounded-full transition-all hover:bg-slate-100 ${
												link.href === pathname &&
												"font-extrabold text-slate-600"
											}`}
										>
											{link.text}
										</Link>
									))}
								</div>
							</div>
							<div className="flex flex-col gap-6">
								<p className="text-slate-300 font-semibold tracking-wide uppercase pl-2 text-sm">
									Transaction Types
								</p>
								<div className="flex flex-col gap-2">
									{transactionTypeLinks.map((link) => (
										<Link
											key={link.text}
											href={link.href}
											className={`w-max px-3 py-1 text-slate-500 rounded-full transition-all hover:bg-slate-100 ${
												link.href === pathname &&
												"font-extrabold text-slate-600"
											}`}
										>
											{link.text}
										</Link>
									))}
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<Link
									className={`w-max px-3 py-1 text-slate-500 rounded-full transition-all hover:bg-slate-100 ${
										pathname.includes("settings") &&
										"font-extrabold text-slate-600"
									}`}
									href="/settings"
								>
									Settings
								</Link>
								<p
									className="w-max px-3 py-1 text-red-500 cursor-pointer rounded-full transition-all hover:bg-slate-100"
									onClick={async () => {
										mutation.mutate();
										queryClient.invalidateQueries({ queryKey: ["user"] });
										router.push("/auth/login");
									}}
								>
									Log out
								</p>
								<div className="p-3">
									<div className="w-[40px] h-[40px] rounded-full bg-slate-300 flex items-center justify-center hover:bg-slate-200 transition-all cursor-pointer">
										<Link
											href="/settings/profile"
											className="uppercase text-slate-500 hover:text-slate-400"
										>
											{data.name[0]}
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</header>
		)
	);
}
