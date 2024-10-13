"use client";

import url from "@/lib/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface FormData {
	_id: string;
	name: string;
	amount: number;
	comments?: string;
}

export default function useBalanceEditMutation() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/balances`, {
				method: "PUT",
				body: JSON.stringify(formData),
			}).then((res) => res.json()),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["balances"] });
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});

	return mutation;
}
