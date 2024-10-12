"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
	{
		href: "/profile",
		text: "Profile",
	},
	{
		href: "/preferences",
		text: "Preferences",
	},
];

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	return (
		<div className="flex border-l-[1px] border-slate-200">
			<div className="flex flex-col gap-2 p-5 bg-white w-[300px]">
				{links.map((link) => (
					<Link
						key={link.href}
						href={`/settings${link.href}`}
						className={`w-max px-3 py-1 text-slate-500 rounded-full transition-all hover:bg-slate-100 ${
							pathname.includes(link.href) && "font-bold text-slate-600"
						}`}
					>
						{link.text}
					</Link>
				))}
			</div>
			{children}
		</div>
	);
}
