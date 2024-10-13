"use client";

import TransactionItem from "./_components/TransactionItem";
import { Balance, TransactionWithBalance } from "@/lib/types";
import { useState } from "react";
import Modal from "./_components/TransactionModal";
import Reminders from "./_components/Reminders";
import useBalancesQuery from "../_hooks/useBalancesQuery";
import usePreferencesQuery from "../_hooks/usePreferencesQuery";
import BalanceItem from "./_components/BalanceItem";
import BalanceModal from "./_components/BalanceModal";

export default function Forecast() {
	const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
	const [selectedTransaction, setSelectedTransaction] = useState(
		{} as TransactionWithBalance
	);

	const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
	const [selectedBalance, setSelectedBalance] = useState({} as Balance);

	const {
		totalBalance,
		balancePending,
		transactionsWithBalance,
		isTransactionsPending,
		balances,
	} = useBalancesQuery();

	const { preferences, isPreferencesPending } = usePreferencesQuery();

	return (
		<div className="flex gap-8 p-8">
			<div className="flex flex-col flex-1 w-[1000px]">
				<div className="p-5 bg-white rounded-lg h-[90vh]">
					{balancePending || isPreferencesPending ? (
						<p className="text-slate-400 font-light p-2">Loading...</p>
					) : (
						<div className="flex items-center gap-8 pb-4">
							<div className="flex py-2 flex-col">
								<p className="text-sm text-gray-400 w-max">Total Balance</p>
								<p className="text-2xl w-max">
									{preferences.currency}
									{totalBalance.toLocaleString()}
								</p>
							</div>
							<div className="flex w-full overflow-auto items-center p-2 px-4 border-[1px] border-slate-200 rounded-lg gap-8">
								{balances.map((balance) => (
									<BalanceItem
										key={balance._id}
										currency={preferences.currency}
										balance={balance}
										setIsModalOpen={setIsBalanceModalOpen}
										setSelectedBalance={setSelectedBalance}
									/>
								))}
								{isBalanceModalOpen ? (
									<BalanceModal
										balance={selectedBalance}
										currency={preferences.currency}
										setIsModalOpen={setIsBalanceModalOpen}
									/>
								) : null}
							</div>
						</div>
					)}
					<div className="flex p-4 border-t-[1px] border-slate-200 text-gray-400">
						<div className="w-[30%]">
							<p className="text-sm">Name</p>
						</div>
						<div className="w-[18%]">
							<p className="text-sm">Amount</p>
						</div>
						<div className="w-[18%]">
							<p className="text-sm">Due Date</p>
						</div>
						<div className="w-[18%]">
							<p className="text-sm">Type</p>
						</div>
						<div className="w-[18%]">
							<p className="text-sm">Balance</p>
						</div>
					</div>
					<div className="flex flex-col overflow-auto h-[68vh] rounded-lg border-[1px] border-slate-200">
						{isTransactionsPending || isPreferencesPending ? (
							<p className="text-sm text-slate-400 p-2">Loading...</p>
						) : (
							transactionsWithBalance.map(
								(transaction: TransactionWithBalance) => (
									<TransactionItem
										key={transaction._id}
										isModalOpen={isTransactionModalOpen}
										setIsModalOpen={setIsTransactionModalOpen}
										setSelectedTransaction={setSelectedTransaction}
										transaction={transaction}
										balanceRanges={preferences.balanceRanges}
									/>
								)
							)
						)}
						{isTransactionModalOpen ? (
							<Modal
								isModalOpen={isTransactionModalOpen}
								setIsModalOpen={setIsTransactionModalOpen}
								setSelectedTransaction={setSelectedTransaction}
								selectedTransaction={selectedTransaction}
							/>
						) : null}
					</div>
				</div>
			</div>
			<Reminders />
		</div>
	);
}
