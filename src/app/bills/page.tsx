"use client";

import { Bill } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function Bills() {
	const queryClient = useQueryClient();

	const [name, setName] = useState("");
	const [amount, setAmount] = useState(0);
	const [day, setDay] = useState(0);
	const [months, setMonths] = useState(0);

	const { isPending, isError, data, error } = useQuery({
		queryKey: ["bills"],
		queryFn: () =>
			fetch("http://localhost:3000/api/bills").then((res) => res.json()),
	});

	const mutation = useMutation({
		mutationFn: (formData: any) =>
			fetch("http://localhost:3000/api/bills", {
				method: "POST",
				body: JSON.stringify(formData),
			}),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bills"] }),
	});

	if (isPending) return <div>loading</div>;
	if (isError) return <div>error: {error.message}</div>;

	return (
		<div>
			<h1>Bills</h1>
			<ul>
				{data.map((bill: Bill) => (
					<li key={bill._id}>{bill.name}</li>
				))}
			</ul>
			<form
				className="flex flex-col gap-2 w-[700px]"
				onSubmit={async (e) => {
					e.preventDefault();
					mutation.mutate({ name, amount, day, months });
					setName("");
					setAmount(0);
					setDay(0);
					setMonths(0);
				}}
			>
				<div className="flex flex-col">
					<label htmlFor="name">Name</label>
					<input
						name="name"
						className="border-2"
						value={name}
						onChange={(e) => setName(e.currentTarget.value)}
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="amount">Amount</label>
					<input
						name="amount"
						className="border-2"
						type="number"
						value={amount}
						onChange={(e) => setAmount(Number(e.currentTarget.value))}
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="day">Day</label>
					<input
						name="day"
						className="border-2"
						type="number"
						value={day}
						onChange={(e) => setDay(Number(e.currentTarget.value))}
					/>
				</div>
				<div className="flex flex-col">
					<label htmlFor="months">Months</label>
					<input
						name="months"
						className="border-2"
						type="number"
						value={months}
						onChange={(e) => setMonths(Number(e.currentTarget.value))}
					/>
				</div>
				<button className="border-2 border-black p-2" type="submit">
					Submit
				</button>
			</form>
		</div>
	);
}
