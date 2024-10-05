"use client";

import url from "@/lib/url";
import { useQuery } from "@tanstack/react-query";

export default function Test() {
	const { data, isPending, isError, error } = useQuery({
		queryKey: ["test"],
		queryFn: () => fetch(`${url}/api/test`).then((res) => res.json()),
	});

	if (isPending) return <p>test page loading</p>;
	if (isError) return <p>{error.message}</p>;

	console.log(data);

	return <p>{data}</p>;
}
