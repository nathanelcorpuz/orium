"use client";

import loader from "@/lib/loader";
import { Bill } from "@/lib/types";
import url from "@/lib/url";
import { useQuery } from "@tanstack/react-query";

export default function useBillsQuery() {
	const { isPending, data } = useQuery({
		queryKey: ["bills"],
		queryFn: async () => {
			
			return fetch(`${url}/api/bills`).then((res) => res.json());
		},
	});

	let totalBills = 0;

	const bills: Bill[] = data;

	if (bills) {
		bills.forEach((bill) => {
			totalBills = totalBills + bill.amount;
		});
	}

	return { bills, totalBills, billsPending: isPending };
}
