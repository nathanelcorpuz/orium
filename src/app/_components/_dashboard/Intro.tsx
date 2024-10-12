"use client";

import { useRouter } from "next/navigation";

interface IntroData {
	data: {
		name: string;
		email: string;
	};
}

export default function Intro({ data }: IntroData) {
	const router = useRouter();
	return (
		<div className="flex justify-between">
			<div className="flex gap-24 items-center w-full">
				<div className="flex flex-col gap-2">
					<p className="text-2xl">Hello, {data.name}.</p>
					<p className="text-sm text-slate-400">Welcome to your dashboard.</p>
				</div>
				<div className="">
					<p className="text-slate-400 text-sm">
						Not sure what to do? Click <a className="underline">here</a> to visit our guide.
					</p>
				</div>
			</div>
			<div className="flex gap-2">
				<button
					className="
					h-[45px] w-[150px] border-[1px]
					rounded-md transition-all bg-slate-500
					text-white hover:bg-slate-400 text-lg"
					onClick={() => router.push("/forecast")}
				>
					Forecast
				</button>
				<button
					className="
					h-[45px] w-[150px] border-[1px]
					rounded-md transition-all bg-slate-500
					text-white hover:bg-slate-400 text-lg"
					onClick={() => router.push("/balances")}
				>
					Balances
				</button>
				<button
					className="
					h-[45px] w-[150px] border-[1px]
					rounded-md transition-all bg-slate-500
					text-white hover:bg-slate-400 text-lg"
					onClick={() => router.push("/history")}
				>
					History
				</button>
				<button
					className="
					h-[45px] w-[150px] border-[1px]
					rounded-md transition-all bg-slate-500
					text-white hover:bg-slate-400 text-lg"
					onClick={() => router.push("/settings/preferences")}
				>
					Preferences
				</button>
			</div>
		</div>
	);
}
