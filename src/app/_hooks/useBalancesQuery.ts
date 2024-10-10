"use client";

import loader from "@/lib/loader";
import { Balance } from "@/lib/types";
import url from "@/lib/url";
import { useQuery } from "@tanstack/react-query";

export default function useBalancesQuery() {
	const { isPending: balancePending, data } = useQuery({
		queryKey: ["balances"],
		queryFn: async () => {
			await loader();
			return fetch(`${url}/api/balances`).then((res) => res.json());
		},
	});

	const balances: Balance[] = data;
	let totalBalance = 0;

	if (balances) {
		balances.forEach((bal) => {
			totalBalance += Number(bal.amount);
		});
	}

	return { balances, totalBalance, balancePending };
}
