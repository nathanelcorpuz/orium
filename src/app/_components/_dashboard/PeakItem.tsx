import { Preferences } from "@/lib/types";

interface PeakItemInterface {
	monthYear: string;
	peak: number;
	drop: number;
	preferences: Preferences;
}

export default function PeakItem({
	monthYear,
	peak,
	drop,
	preferences,
}: PeakItemInterface) {
	const { balanceRanges } = preferences;

	const peakDanger = peak < balanceRanges[0];
	const peakLow = peak > balanceRanges[0] && peak < balanceRanges[1];
	const peakMed = peak >= balanceRanges[1] && peak < balanceRanges[2];
	const peakHigh = peak >= balanceRanges[2] && peak < balanceRanges[3];
	const peakHigher = peak >= balanceRanges[3] && peak < balanceRanges[4];
	const peakHighest = peak >= balanceRanges[4];

	const dropDanger = drop < balanceRanges[0];
	const dropLow = drop > balanceRanges[0] && drop < balanceRanges[1];
	const dropMed = drop >= balanceRanges[1] && drop < balanceRanges[2];
	const dropHigh = drop >= balanceRanges[2] && drop < balanceRanges[3];
	const dropHigher = drop >= balanceRanges[3] && drop < balanceRanges[4];
	const dropHighest = drop >= balanceRanges[4];

	return (
		<div
			className="flex p-2 min-w-[85px] items-start justify-start"
			key={monthYear}
		>
			<div className="flex flex-col gap-2 items-start">
				<p className="text-xs text-gray-400">{monthYear}</p>
				<div className="flex flex-col gap-1">
					<p
						className={`
            text-xs
            py-1 px-2 rounded-full
            ${peakDanger && "bg-gray-500 text-white"}
            ${peakLow && "bg-red-200"}	
            ${peakMed && "bg-white"}
            ${peakHigh && "bg-green-100"}
            ${peakHigher && "bg-green-200"}
            ${peakHighest && "bg-green-300"}
            ${peak === 0 ? "text-slate-50 bg-slate-50" : ""}
            `}
					>
						{preferences.currency}
						{peak.toLocaleString()}
					</p>
					<p
						className={`
            text-xs
            py-1 px-2 rounded-full
            ${dropDanger && "bg-gray-500 text-white"}
            ${dropLow && "bg-red-200"}	
            ${dropMed && "bg-white"}
            ${dropHigh && "bg-green-100"}
            ${dropHigher && "bg-green-200"}
            ${dropHighest && "bg-green-300"}
            ${drop === 0 ? "text-slate-50 bg-slate-50" : ""}
            `}
					>
						{preferences.currency}
						{drop.toLocaleString()}
					</p>
				</div>
			</div>
		</div>
	);
}
