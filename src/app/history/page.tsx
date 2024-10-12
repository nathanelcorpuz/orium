"use client";

import { useQuery } from "@tanstack/react-query";
import HistoryItem from "./_components/HistoryItem";
import { History } from "@/lib/types";
import url from "@/lib/url";
import usePreferencesQuery from "../_hooks/usePreferencesQuery";

export default function Forecast() {
	const { isPending: isHistoryPending, data } = useQuery({
		queryKey: ["history"],
		queryFn: () => fetch(`${url}/api/history`).then((res) => res.json()),
	});

	const { isPreferencesPending } = usePreferencesQuery();

	const isPending = isHistoryPending || isPreferencesPending;

	return isPending ? (
		<div className="w-full h-full flex items-center justify-center">
			<p className="text-slate-400">Loading history...</p>
		</div>
	) : (
		<div className="flex flex-col p-8 z-[-5]">
			<div className="bg-white flex flex-col w-[1400px] p-5 rounded-lg h-[90vh]">
				<div className="flex text-sm p-4 border-slate-200 text-gray-400">
					<div className="w-[19%]">
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
