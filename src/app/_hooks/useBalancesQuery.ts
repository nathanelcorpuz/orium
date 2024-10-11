"use client";


import { Balance, TransactionWithBalance } from "@/lib/types";
import url from "@/lib/url";
import { useQuery } from "@tanstack/react-query";

export default function useBalancesQuery() {
	const { isPending: balancePending, data } = useQuery({
		queryKey: ["balances"],
		queryFn: async () => {
			
			return fetch(`${url}/api/balances`).then((res) => res.json());
		},
	});

	const { isPending: isTransactionsPending, data: transactions } = useQuery({
		queryKey: ["transactions"],
		queryFn: () =>
			fetch(`${url}/api/forecast`).then((res) => {
				return res.json();
			}),
	});

	const balances: Balance[] = data;
	let totalBalance = 0;

	let transactionsWithBalance: TransactionWithBalance[] = [];

	if (balances) {
		balances.forEach((bal) => {
			totalBalance += Number(bal.amount);
		});

		let currentBalance = totalBalance;

		transactionsWithBalance = transactions.map(
			(transaction: TransactionWithBalance) => {
				currentBalance = currentBalance + transaction.amount;
				return {
					...transaction,
					forecastedBalance: Math.round(currentBalance),
				};
			}
		);
	}

	return {
		balances,
		totalBalance,
		balancePending,
		transactionsWithBalance,
		isTransactionsPending,
	};
}
