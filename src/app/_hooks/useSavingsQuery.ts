"use client";
import loader from "@/lib/loader";
import { Transaction } from "@/lib/types";
import url from "@/lib/url";
import { useQuery } from "@tanstack/react-query";
import { differenceInDays, format } from "date-fns";

export default function useSavingsQuery() {
	const { isPending, data } = useQuery({
		queryKey: ["savings"],
		queryFn: () => fetch(`${url}/api/savings`).then((res) => res.json()),
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

	let totalSavings = 0;

	let finalSavingsDate = "No savings";

	let daysUntilFinalSavingsDate = 0;

	if (transactionsData) {
		transactionsData.forEach((transaction: Transaction) => {
			if (transaction.type === "savings") {
				totalSavings = totalSavings + transaction.amount;
			}
		});

		const savingsTransactions = transactionsData.filter(
			(transaction: Transaction) => transaction.type === "savings"
		);

		const lastTransaction: Transaction =
			savingsTransactions[savingsTransactions.length - 1];

		if (lastTransaction) {
			finalSavingsDate = format(lastTransaction.dueDate, "MMM d, yyyy");

			daysUntilFinalSavingsDate = differenceInDays(
				finalSavingsDate,
				new Date()
			);
		}
	}

	return {
		isSavingsPending: isTransactionsPending || isPending,
		totalSavings,
		savings: data,
		transactions: transactionsData,
		daysUntilFinalSavingsDate,
		finalSavingsDate,
	};
}
