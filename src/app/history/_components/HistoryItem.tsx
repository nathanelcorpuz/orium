import usePreferencesQuery from "@/app/_hooks/usePreferencesQuery";
import { History } from "@/lib/types";
import { format } from "date-fns";

interface HistoryItemType {
	history: History;
}

export default function HistoryItem({ history }: HistoryItemType) {
	const { preferences } = usePreferencesQuery();
	return (
		<div className="flex py-1 px-4 border-b-[1px] border-b-black border-opacity-[0.1] text-sm">
			<div className="w-[20%] items-center flex">
				<p>{history.name}</p>
			</div>
			<div className="w-[20%] items-center flex gap-4">
				<p>
					{preferences.currency}
					{history.forecastedAmount.toLocaleString()}
				</p>
				<p>
					{preferences.currency}
					{history.actualAmount.toLocaleString()}
				</p>
			</div>
			<div className="w-[20%] items-center flex gap-4">
				<p>{format(history.forecastedDate, "MMM d, y")}</p>
				<p>{format(history.actualDate, "MMM d, y")}</p>
			</div>
			<div className="w-[20%] items-center flex gap-4">
				<p>
					{preferences.currency}
					{history.forecastedBalance.toLocaleString()}
				</p>
			</div>
			<div className="w-[20%] items-center">
				<p>{history.type}</p>
			</div>
		</div>
	);
}
