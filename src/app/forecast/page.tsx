"use client";

import TransactionItem from "./_components/TransactionItem";
import { TransactionWithBalance } from "@/lib/types";
import { useState } from "react";
import Modal from "./_components/Modal";
import Reminders from "./_components/Reminders";
import useBalancesQuery from "../_hooks/useBalancesQuery";
import usePreferencesQuery from "../_hooks/usePreferencesQuery";

export default function Forecast() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTransaction, setSelectedTransaction] = useState(
		{} as TransactionWithBalance
	);

	const {
		totalBalance,
		balancePending,
		transactionsWithBalance,
		isTransactionsPending,
	} = useBalancesQuery();

	const { preferences, isPreferencesPending } = usePreferencesQuery();

	return (
		<div className="flex gap-8 p-8">
			<div className="flex flex-col flex-1 w-[1000px]">
				<div className="p-5 bg-white rounded-lg h-[90vh]">
					<div className="flex py-2 flex-col">
						<p className="text-sm text-gray-400">Total Balance</p>
						<p className="text-2xl">
							{balancePending ? "Loading..." : `₱${totalBalance}`}
						</p>
					</div>
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
					<div className="flex flex-col overflow-auto h-[70vh] rounded-lg border-[1px] border-slate-200">
						{isTransactionsPending || isPreferencesPending ? (
							<p className="text-sm text-slate-400 p-2">Loading...</p>
						) : (
							transactionsWithBalance.map(
								(transaction: TransactionWithBalance) => (
									<TransactionItem
										key={transaction._id}
										isModalOpen={isModalOpen}
										setIsModalOpen={setIsModalOpen}
										setSelectedTransaction={setSelectedTransaction}
										transaction={transaction}
										balanceRanges={preferences.balanceRanges}
									/>
								)
							)
						)}
						{isModalOpen ? (
							<Modal
								isModalOpen={isModalOpen}
								setIsModalOpen={setIsModalOpen}
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
