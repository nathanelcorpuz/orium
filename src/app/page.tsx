"use client";

import url from "@/lib/url";
import { useQuery } from "@tanstack/react-query";
import Intro from "./_components/_dashboard/Intro";
import Numbers from "./_components/_dashboard/Numbers";
import Peaks from "./_components/_dashboard/Peaks";

export default function Home() {
	const { data, isPending } = useQuery({
		queryKey: ["user"],
		queryFn: () => fetch(`${url}/api/user`).then((res) => res.json()),
	});

	if (isPending) {
		return (
			<div className="p-4 w-full h-full flex items-center justify-center">
				<p className="text-2xl">Loading...</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col w-full p-10 gap-8">
			<Intro data={data} />
			<div className="border-b-[1px] border-slate-300"></div>
			<Numbers />
			<Peaks />
		</div>
	);
}
