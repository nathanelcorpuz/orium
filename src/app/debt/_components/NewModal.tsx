"use client";

import url from "@/lib/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";

interface NewModal {
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function NewModal({ setIsModalOpen }: NewModal) {
	const queryClient = useQueryClient();

	const [name, setName] = useState("");
	const [amount, setAmount] = useState("");
	const [day, setDay] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [comments, setComments] = useState("");

	interface FormData {
		name: string;
		amount: number;
		day: number;
		startDate: string;
		endDate: string;
		comments?: string;
	}

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/debts`, {
				method: "POST",
				body: JSON.stringify(formData),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["debts"] });
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});

	const onClickClose = () => setIsModalOpen(false);
	const onClickSubmit = () => {
		setIsModalOpen(false);
		mutation.mutate({
			name,
			amount: Number(amount),
			day: Number(day),
			startDate: String(startDate),
			endDate: String(endDate),
			comments,
		});
	};

	return (
		<div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
			<div className="bg-black opacity-25 w-[100%] h-[100%] absolute z-[-2]"></div>
			<div className="w-[500px] bg-white z-[2] flex flex-col p-8 gap-8 rounded-2xl">
				<div className="flex flex-col py-4 gap-4">
					<div className="flex flex-col gap-6">
						<h1 className="text-2xl font-bold">New Debt</h1>
						<div className="flex flex-col">
							<label htmlFor="name">Name</label>
							<input
								name="name"
								className="border-[1px] h-[35px] p-2 rounded-md"
								value={name}
								onChange={(e) => setName(e.currentTarget.value)}
							/>
						</div>
						<div className="flex flex-col">
							<label htmlFor="amount">Amount</label>
							<input
								name="amount"
								className="border-[1px] h-[35px] p-2 rounded-md"
								type="text"
								value={amount}
								onChange={(e) => setAmount(e.currentTarget.value)}
							/>
						</div>
						<div className="flex flex-col">
							<label htmlFor="day">Day</label>
							<input
								name="day"
								className="border-[1px] h-[35px] p-2 rounded-md"
								type="text"
								value={day}
								onChange={(e) => setDay(e.currentTarget.value)}
							/>
						</div>
						<div className="flex flex-col">
							<label htmlFor="startDate">Start Date</label>
							<input
								name="startDate"
								className="border-[1px] h-[35px] p-2 rounded-md"
								type="month"
								value={startDate}
								onChange={(e) => setStartDate(e.currentTarget.value)}
							/>
						</div>
						<div className="flex flex-col">
							<label htmlFor="endDate">End Date</label>
							<input
								name="endDate"
								className="border-[1px] h-[35px] p-2 rounded-md"
								type="month"
								value={endDate}
								onChange={(e) => setEndDate(e.currentTarget.value)}
							/>
						</div>
						<div className="flex flex-col">
							<label htmlFor="comments">Comments</label>
							<input
								name="comments"
								className="border-[1px] h-[35px] p-2 rounded-md"
								type="text"
								value={comments}
								onChange={(e) => setComments(e.currentTarget.value)}
							/>
						</div>
						<div className="flex mt-auto justify-between">
							<button
								className="py-2 px-8 text-xl font-bold border-2 rounded-lg"
								onClick={onClickClose}
							>
								Close
							</button>
							<button
								className="py-2 px-8 text-xl font-bold border-2 rounded-lg"
								onClick={onClickSubmit}
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
