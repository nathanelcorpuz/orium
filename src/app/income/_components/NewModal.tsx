"use client";

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
	const [frequency, setFrequency] = useState("");
	const [dayOfWeek, setDayOfWeek] = useState("");
	const [instances, setInstances] = useState("");
	const [comments, setComments] = useState("");

	const mutation = useMutation({
		mutationFn: (formData: any) =>
			fetch("http://localhost:3000/api/income", {
				method: "POST",
				body: JSON.stringify(formData),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["income"] });
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
			instances: Number(instances),
			frequency,
			dayOfWeek: Number(dayOfWeek),
			comments,
		});
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
							<label htmlFor="frequency">Frequency</label>
							<input
								name="frequency"
								className="border-[1px] h-[35px] p-2 rounded-md"
								type="text"
								value={frequency}
								onChange={(e) => setFrequency(e.currentTarget.value)}
							/>
						</div>
						<div className="flex flex-col">
							<label htmlFor="dayOfWeek">Day Of Week</label>
							<input
								name="dayOfWeek"
								className="border-[1px] h-[35px] p-2 rounded-md"
								type="text"
								value={dayOfWeek}
								onChange={(e) => setDayOfWeek(e.currentTarget.value)}
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
							<label htmlFor="instances">Instances</label>
							<input
								name="instances"
								className="border-[1px] h-[35px] p-2 rounded-md"
								type="text"
								value={instances}
								onChange={(e) => setInstances(e.currentTarget.value)}
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
					</form>
				</div>
			</div>
		</div>
	);
}
