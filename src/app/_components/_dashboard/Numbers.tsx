"use client";

import useBalancesQuery from "@/app/_hooks/useBalancesQuery";
import useBillsQuery from "@/app/_hooks/useBillsQuery";
import useDebtsQuery from "@/app/_hooks/useDebtsQuery";
import useIncomeQuery from "@/app/_hooks/useIncomeQuery";
import useSavingsQuery from "@/app/_hooks/useSavingsQuery";

export default function Numbers() {
	const { balances, balancePending, totalBalance } = useBalancesQuery();
	const { totalBills, billsPending } = useBillsQuery();
	const { totalMonthlyIncome, incomePending } = useIncomeQuery();
	const { isDebtsPending, debtFreeByDate, daysUntilDebtFree, totalDebts } =
		useDebtsQuery();
	const {
		isSavingsPending,
		totalSavings,
		finalSavingsDate,
		daysUntilFinalSavingsDate,
	} = useSavingsQuery();

	return (
		<div className="flex gap-10">
			<div className="w-[50%] flex flex-col gap-6 bg-white p-6 rounded-lg">
				<div className="flex items-center gap-24">
					<div className="flex flex-col">
						<p className="text-xs text-slate-400">Total Balance</p>
						{balancePending ? (
							<p className="text-slate-300">Loading...</p>
						) : (
							<p className="text-2xl font-bold">{totalBalance}</p>
						)}
					</div>
					<div className="flex flex-col">
						<p className="text-xs text-slate-400">Total Monthly Bills</p>
						{billsPending ? (
							<p className="text-slate-300">Loading...</p>
						) : (
							<p className="text-2xl font-bold">{totalBills}</p>
						)}
					</div>
					<div className="flex flex-col">
						<p className="text-xs text-slate-400">Total Monthly Income</p>
						{incomePending ? (
							<p className="text-slate-300">Loading...</p>
						) : (
							<p className="text-2xl font-bold">{totalMonthlyIncome}</p>
						)}
					</div>
				</div>
				<div className="border-b-[1px] border-slate-200"></div>
				<div className="flex gap-10 flex-wrap">
					{balancePending ? (
						<p className="text-slate-300">Loading...</p>
					) : balances.length > 0 ? (
						balances.map((balance) => (
							<div key={balance._id}>
								<p className="text-xs text-slate-400">{balance.name}</p>
								<p>{balance.amount}</p>
							</div>
						))
					) : (
						<p className="p-4 text-sm text-slate-400">No balances yet...</p>
					)}
				</div>
			</div>
			<div className="w-[50%] flex flex-col bg-white p-6 rounded-lg gap-6">
				<div className="flex w-full h-full">
					<div className="w-full flex flex-col">
						<p className="text-xs text-slate-400">Remaining Debt</p>
						{isDebtsPending ? (
							<p className="text-slate-300">Loading...</p>
						) : (
							<p className="font-bold">{totalDebts * -1}</p>
						)}
					</div>
					<div className="w-full flex flex-col">
						<p className="text-xs text-slate-400">Debt-free By</p>
						{isDebtsPending ? (
							<p className="text-slate-300">Loading...</p>
						) : (
							<p className="text-sm">{debtFreeByDate}</p>
						)}
					</div>
					<div className="w-full flex flex-col">
						<p className="text-xs text-slate-400">Days Until Debt-free</p>
						{isDebtsPending ? (
							<p className="text-slate-300">Loading...</p>
						) : (
							<p className="text-sm">{daysUntilDebtFree}</p>
						)}
					</div>
				</div>
				<div className="border-b-[1px] border-slate-200"></div>
				<div className="flex w-full h-full">
					<div className="w-full flex flex-col">
						<p className="text-xs text-slate-400">Remaining Savings</p>
						{isSavingsPending ? (
							<p className="text-slate-300">Loading...</p>
						) : (
							<p className="font-bold">{totalSavings}</p>
						)}
					</div>
					<div className="w-full flex flex-col">
						<p className="text-xs text-slate-400">Final Savings Date</p>
						{isSavingsPending ? (
							<p className="text-slate-300">Loading...</p>
						) : (
							<p className="text-sm">{finalSavingsDate}</p>
						)}
					</div>
					<div className="w-full flex flex-col">
						<p className="text-xs text-slate-400">
							Days Until Final Savings Date
						</p>
						{isSavingsPending ? (
							<p className="text-slate-300">Loading...</p>
						) : (
							<p className="text-sm">{daysUntilFinalSavingsDate}</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
