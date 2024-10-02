import { History } from "@/lib/types";
import { format } from "date-fns";

interface HistoryItemType {
	history: History;
}

export default function HistoryItem({ history }: HistoryItemType) {
	return (
		<div className="flex py-2 px-4 border-b-[1px] border-b-black border-opacity-[0.1] hover:bg-slate-50 hover:cursor-pointer">
			<div className="w-[20%]">
				<p>{history.name}</p>
			</div>
			<div className="w-[20%] flex gap-4">
				<p>{history.forecastedAmount}</p>
				<p>{history.actualAmount}</p>
			</div>
			<div className="w-[20%] flex gap-4">
				<p>{format(history.forecastedDate, "MMM d, y")}</p>
				<p>{format(history.actualDate, "MMM d, y")}</p>
			</div>
			<div className="w-[20%] flex gap-4">
				<p>{history.forecastedBalance}</p>
				<p>{history.actualBalance}</p>
			</div>
			<div className="w-[20%]">
				<p>{history.type}</p>
			</div>
		</div>
	);
}
