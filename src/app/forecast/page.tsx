"use client";

import { useQuery } from "@tanstack/react-query";
import TransactionItem from "./_components/TransactionItem";
import { Balance, TransactionWithBalance } from "@/lib/types";
import { useState } from "react";
import Modal from "./_components/Modal";

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
			fetch("http://localhost:3000/api/balances").then((res) => res.json()),
	});

	const { isPending, isError, data, error } = useQuery({
		queryKey: ["transactions"],
		queryFn: () =>
			fetch("http://localhost:3000/api/forecast").then((res) => res.json()),
	});

	if (isPending || balancePending) return <div>Loading data</div>;

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
		<div className="flex flex-col">
			<div className="flex gap-2 text-xl items-center py-2">
				<p>Total balance</p>
				<p>₱{totalBalance}</p>
			</div>
			<div className="p-5 bg-slate-50 rounded-lg max-w-[1000px]">
				<div className="flex font-bold py-2 px-4">
					<div className="w-[30%]">
						<p>Name</p>
					</div>
					<div className="w-[18%]">
						<p>Amount</p>
					</div>
					<div className="w-[18%]">
						<p>Due Date</p>
					</div>
					<div className="w-[18%]">
						<p>Type</p>
					</div>
					<div className="w-[18%]">
						<p>Balance</p>
					</div>
				</div>
				<div className="flex flex-col h-[80vh] overflow-auto">
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
	);
}
