import useBalancesQuery from "@/app/_hooks/useBalancesQuery";
import { TransactionWithBalance } from "@/lib/types";
import { format, getMonth, getYear } from "date-fns";

const placeholderPeaksAndDrops = [
	{ month: "Jan" },
	{ month: "Feb" },
	{ month: "Mar" },
	{ month: "Apr" },
	{ month: "May" },
	{ month: "Jun" },
	{ month: "Jul" },
	{ month: "Aug" },
	{ month: "Sep" },
	{ month: "Oct" },
	{ month: "Nov" },
	{ month: "Dec" },
];

export default function Peaks() {
	const { transactionsWithBalance, balancePending, isTransactionsPending } =
		useBalancesQuery();

	let years: string[] = [];

	let monthYears: string[] = [];

	let peaksAndDrops: { monthYear: string; peak: number; drop: number }[] = [];

	if (transactionsWithBalance) {
		transactionsWithBalance.forEach((transaction: TransactionWithBalance) => {
			const year = getYear(transaction.dueDate);
			if (!years.includes(String(year))) {
				years.push(String(year));
			}

			const date = format(transaction.dueDate, "MMM yyyy");

			if (!monthYears.includes(date)) {
				monthYears.push(date);
			}
		});

		peaksAndDrops = monthYears.map((monthYear) => {
			const monthYearTransactions = transactionsWithBalance.filter(
				(transaction) => {
					const transactionMonthYear = format(transaction.dueDate, "MMM yyyy");
					return transactionMonthYear === monthYear;
				}
			);

			const monthYearBalances = monthYearTransactions.map(
				(transaction) => transaction.forecastedBalance
			);

			return {
				monthYear,
				peak: Math.max(...monthYearBalances),
				drop: Math.min(...monthYearBalances),
			};
		});
	}

	const yearsWithPeaksAndDrops = years.map((year) => {
		const filteredPeaksAndDrops = peaksAndDrops.filter(
			(peakAndDrop) => String(getYear(peakAndDrop.monthYear)) === year
		);
		return {
			year,
			peaksAndDrops: filteredPeaksAndDrops,
		};
	});

	return (
		<div className="w-[100%] flex h-[500px] flex-col gap-4 bg-white p-6 rounded-lg">
			<p className="text-2xl">Upcoming Balance Peaks and Drops</p>
			{isTransactionsPending || balancePending ? (
				<div className="w-full h-full flex items-center justify-center">
					<p className="text-slate-400">Loading...</p>
				</div>
			) : (
				<div className="h-full overflow-auto flex flex-col gap-8 bg-slate-50 rounded-lg p-6">
					{yearsWithPeaksAndDrops.map(({ year, peaksAndDrops }) => (
						<div key={year} className="flex items-center justify-between">
							<p className="text-gray-400 font-bold text-sm">{year}</p>
							{peaksAndDrops.length !== 12
								? placeholderPeaksAndDrops.map(({ month }) => {
										let finalPeakAndDrop = {
											monthYear: `${month} ${year}`,
											peak: 0,
											drop: 0,
										};
										peaksAndDrops.forEach((peakAndDrop) => {
											if (
												getMonth(peakAndDrop.monthYear) ===
												getMonth(new Date(`${month} ${year}`))
											) {
												finalPeakAndDrop = structuredClone(peakAndDrop);
											}
										});
										return (
											<div
												className="flex p-2"
												key={finalPeakAndDrop.monthYear}
											>
												<div className="flex flex-col gap-2">
													<p className="text-xs text-gray-400">
														{finalPeakAndDrop.monthYear}
													</p>
													<div>
														<p className="text-sm">{finalPeakAndDrop.peak}</p>
														<p className="text-sm">{finalPeakAndDrop.drop}</p>
													</div>
												</div>
											</div>
										);
								  })
								: peaksAndDrops.map(({ monthYear, peak, drop }) => (
										<div className="flex p-2" key={monthYear}>
											<div className="flex flex-col gap-2">
												<p className="text-xs text-gray-400">{monthYear}</p>
												<div>
													<p className="text-sm">{peak}</p>
													<p className="text-sm">{drop}</p>
												</div>
											</div>
										</div>
								  ))}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
