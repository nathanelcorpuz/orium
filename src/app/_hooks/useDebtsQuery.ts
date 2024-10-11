"use client";

import { Transaction } from "@/lib/types";
import url from "@/lib/url";
import { useQuery } from "@tanstack/react-query";
import { differenceInDays, format } from "date-fns";

export default function useDebtsQuery() {
	const { isPending, data } = useQuery({
		queryKey: ["debts"],
		queryFn: () => fetch(`${url}/api/debts`).then((res) => res.json()),
	});

	const { isPending: isTransactionsPending, data: transactionsData } = useQuery(
		{
			queryKey: ["transactions"],
			queryFn: () =>
				fetch(`${url}/api/forecast`).then(async (res) => {
					return res.json();
				}),
		}
	);

	let totalDebts = 0;

	let debtFreeByDate = "No debts";

	let daysUntilDebtFree = 0;

	if (transactionsData && data) {
		transactionsData.forEach((transaction: Transaction) => {
			if (transaction.type === "debt") {
				totalDebts = totalDebts + transaction.amount;
			}
		});

		const debtTransactions = transactionsData.filter(
			(transaction: Transaction) => transaction.type === "debt"
		);

		const lastTransaction: Transaction =
			debtTransactions[debtTransactions.length - 1];

		if (lastTransaction) {
			debtFreeByDate = format(lastTransaction.dueDate, "MMM d, yyyy");

			daysUntilDebtFree = differenceInDays(debtFreeByDate, new Date());
		}
	}

	return {
		isDebtsPending: isTransactionsPending || isPending,
		totalDebts,
		debts: data,
		transactions: transactionsData,
		daysUntilDebtFree,
		debtFreeByDate,
	};
}
