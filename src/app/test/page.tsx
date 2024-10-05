"use client";

import { useQuery } from "@tanstack/react-query";

export default function Test() {
	const { data, isPending, isError, error } = useQuery({
		queryKey: ["test"],
		queryFn: () =>
			fetch("http://localhost:3000/api/test").then((res) => res.json()),
	});

	if (isPending) return <p>test page loading</p>;
	if (isError) return <p>{error.message}</p>;

	console.log(data);

	return <p>{data}</p>;
}
