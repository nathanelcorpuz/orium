"use client";

import url from "@/lib/url";
import { useQuery } from "@tanstack/react-query";

export default function Test() {
	const { data, isPending, isError, error } = useQuery({
		queryKey: ["test"],
		queryFn: () =>
			fetch(`${url}/api/test`).then(async (res) => {
				if (!res.ok) throw new Error(res.statusText);
				return res.json();
			}),
	});

	if (isPending) return <p>test page loading</p>;
	if (isError) return <p>Error: {error.message}</p>;

	return <p>{data}</p>;
}
