"use client";

import { useQuery } from "@tanstack/react-query";
import HistoryItem from "./_components/HistoryItem";
import { History } from "@/lib/types";
import url from "@/lib/url";

export default function Forecast() {
	const { isPending, isError, data, error } = useQuery({
		queryKey: ["history"],
		queryFn: () => fetch(`${url}/api/history`).then((res) => res.json()),
	});

	if (isPending) return <div>Loading data</div>;
	if (isError) return <div>Error: {error.message}</div>;

	return (
		<div className="flex flex-col gap-5">
			<div>
				<div className="flex font-bold py-2 px-4">
					<div className="w-[20%]">
						<p>Name</p>
					</div>
					<div className="w-[20%]">
						<p>Forecasted vs Actual Amount</p>
					</div>
					<div className="w-[20%]">
						<p>Forecasted vs Actual Date</p>
					</div>
					<div className="w-[20%]">
						<p>Forecasted vs Actual Balance</p>
					</div>
					<div className="w-[20%]">
						<p>Type</p>
					</div>
				</div>
				<div className="flex flex-col h-[80vh] overflow-auto">
					{data.map((history: History) => (
						<HistoryItem key={history._id} history={history} />
					))}
				</div>
			</div>
		</div>
	);
}
