"use client";

import { useQuery } from "@tanstack/react-query";
import TransactionItem from "./_components/TransactionItem";
import { Balance, TransactionWithBalance } from "@/lib/types";
import { useState } from "react";
import Modal from "./_components/Modal";
import Reminders from "./_components/Reminders";
import url from "@/lib/url";

export default function Forecast() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTransaction, setSelectedTransaction] = useState(
		{} as TransactionWithBalance
	);

	const {
		isPending: balancePending,
		isError: balanceIsError,
		data: balanceData,
		error: balanceError,
	} = useQuery({
		queryKey: ["balances"],
		queryFn: () =>
			fetch(`${url}/api/balances`).then((res) => {
				if (!res.ok) throw new Error(res.statusText);
				return res.json();
			}),
	});

	const { isPending, isError, data, error } = useQuery({
		queryKey: ["transactions"],
		queryFn: () =>
			fetch(`${url}/api/forecast`).then((res) => {
				if (!res.ok) throw new Error(res.statusText);
				return res.json();
			}),
	});

	if (isPending || balancePending)
		return (
			<div className="flex justify-center items-center w-full h-full">
				<p className="text-lg">Loading data...</p>
			</div>
		);

	if (isError || balanceIsError)
		return <div>Error: {error?.message || balanceError?.message}</div>;

	const balances: Balance[] = balanceData;

	let totalBalance = 0;

	balances.forEach((balance) => {
		totalBalance = totalBalance + balance.amount;
	});

	let currentBalance = totalBalance;

	const transactionsWithBalance = data.map(
		(transaction: TransactionWithBalance) => {
			currentBalance = currentBalance + transaction.amount;
			return {
				...transaction,
				forecastedBalance: Math.round(currentBalance),
			};
		}
	);

	return (
		<div className="flex gap-8 p-8">
			<div className="flex flex-col flex-1 w-[1000px]">
				<div className="p-5 bg-white rounded-lg h-[90vh]">
					<div className="flex py-2 flex-col">
						<p className="text-sm text-gray-400">Total Balance</p>
						<p className="text-2xl">₱{totalBalance}</p>
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
					<div className="flex flex-col overflow-auto h-[70vh] rounded-lg">
						{transactionsWithBalance.map(
							(transaction: TransactionWithBalance) => (
								<TransactionItem
									key={transaction._id}
									isModalOpen={isModalOpen}
									setIsModalOpen={setIsModalOpen}
									setSelectedTransaction={setSelectedTransaction}
									transaction={transaction}
								/>
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
