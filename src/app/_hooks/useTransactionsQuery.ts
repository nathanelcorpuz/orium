"use client";

import loader from "@/lib/loader";
import url from "@/lib/url";
import { useQuery } from "@tanstack/react-query";

export default function useTransactionsQuery() {
	const { isPending: isTransactionsPending, data: transactionsData } = useQuery(
		{
			queryKey: ["transactions"],
			queryFn: () =>
				fetch(`${url}/api/forecast`).then(async (res) => {
					
					return res.json();
				}),
		}
	);

	return { isTransactionsPending, transactionsData };
}
