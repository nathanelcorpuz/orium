"use client";

import { useQuery } from "@tanstack/react-query";
import TransactionItem from "./_components/TransactionItem";
import { Transaction } from "@/lib/types";

interface TransactionWithBalance extends Transaction {
	forecastedBalance: number;
}

export default function Forecast() {
	const { isPending, isError, data, error } = useQuery({
		queryKey: ["transactions"],
		queryFn: () =>
			fetch("http://localhost:3000/api/forecast").then((res) => res.json()),
	});

	if (isPending) return <div>Loading data</div>;
	if (isError) return <div>Error: {error.message}</div>;

	let currentBalance = 23000;

	const transactionsWithBalance = data.map(
		(transaction: TransactionWithBalance) => {
			currentBalance = currentBalance + transaction.amount;
			return {
				...transaction,
				forecastedBalance: currentBalance,
			};
		}
	);

	return (
		<div className="flex flex-col gap-5">
			<div className="flex gap-2">
				<p>Total balance</p>
				<p>₱23,000</p>
			</div>
			<div>
				<div className="flex font-bold py-2 px-4">
					<div className="w-[20%]">
						<p>Name</p>
					</div>
					<div className="w-[20%]">
						<p>Amount</p>
					</div>
					<div className="w-[20%]">
						<p>Due Date</p>
					</div>
					<div className="w-[20%]">
						<p>Type</p>
					</div>
					<div className="w-[20%]">
						<p>Balance</p>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					{transactionsWithBalance.map(
						(transaction: TransactionWithBalance) => (
							<TransactionItem
								key={transaction._id}
								transaction={transaction}
							/>
						)
					)}
				</div>
			</div>
		</div>
	);
}
