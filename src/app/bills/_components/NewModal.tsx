"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";

interface NewModal {
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
	isModalOpen: boolean;
}

export default function NewModal({ setIsModalOpen, isModalOpen }: NewModal) {
	const queryClient = useQueryClient();

	const [name, setName] = useState("");
	const [amount, setAmount] = useState("");
	const [day, setDay] = useState("");
	const [months, setMonths] = useState("");

	const mutation = useMutation({
		mutationFn: (formData: any) =>
			fetch("http://localhost:3000/api/bills", {
				method: "POST",
				body: JSON.stringify(formData),
			}),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bills"] }),
	});

	const onClickClose = () => setIsModalOpen(false);
	const onClickSubmit = () => {
		setIsModalOpen(false);
	};

	return (
		<div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
			<div className="bg-black opacity-25 w-[100%] h-[100%] absolute z-[-2]"></div>
			<div className="w-[500px] bg-white z-[2] flex flex-col p-8 gap-8 rounded-2xl">
				<div className="flex flex-col py-4 gap-4">
					<form
						className="flex flex-col gap-6"
						onSubmit={async (e) => {
							e.preventDefault();
						}}
					>
						<h1 className="text-2xl font-bold">New Bill</h1>
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
								onChange={(e) => setAmount(e.currentTarget.value)}
							/>
						</div>
						<div className="flex flex-col">
							<label htmlFor="day">Day</label>
							<input
								name="day"
								className="border-2"
								type="number"
								value={day}
								onChange={(e) => setDay(e.currentTarget.value)}
							/>
						</div>
						<div className="flex flex-col">
							<label htmlFor="months">Months</label>
							<input
								name="months"
								className="border-2"
								type="number"
								value={months}
								onChange={(e) => setMonths(e.currentTarget.value)}
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
					</form>
				</div>
			</div>
		</div>
	);
}
