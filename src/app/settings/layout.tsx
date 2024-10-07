"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	console.log(pathname.includes("profile"));
	return (
		<div className="flex">
			<ul className="bg-white border-l-[1px] border-slate-200 p-10 w-60 flex flex-col gap-8">
				<li>
					<Link
						href="/settings/profile"
						className={`${pathname.includes("profile") ? "font-bold" : ""}`}
					>
						Profile
					</Link>
				</li>
				<li>Preferences</li>
			</ul>
			{children}
		</div>
	);
}
