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
	const [startDate, setStartDate] = useState("");
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
			startDate,
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
							<select
								name="frequency"
								id="frequency"
								value={frequency}
								onChange={(e) => setFrequency(e.currentTarget.value)}
								className="border border-opacity-[0.1] rounded-lg p-2"
							>
								<option value="">-Choose an option-</option>
								<option value="monthly">Monthly</option>
								<option value="15-30">15-30</option>
								<option value="weekly">Weekly</option>
								<option value="bi-weekly">Bi-weekly</option>
							</select>
						</div>

						{frequency === "monthly" && (
							<div className="flex flex-col">
								<label htmlFor="day">Day (1-30)</label>
								<input
									name="day"
									className="border-[1px] h-[35px] p-2 rounded-md"
									type="text"
									value={day}
									onChange={(e) => setDay(e.currentTarget.value)}
								/>
							</div>
						)}

						{(frequency === "bi-weekly" || frequency === "weekly") && (
							<div className="flex flex-col">
								<label htmlFor="startDate">Start Date</label>
								<input
									name="startDate"
									className="border-[1px] h-[35px] p-2 rounded-md"
									type="date"
									value={startDate}
									onChange={(e) => setStartDate(e.currentTarget.value)}
								/>
							</div>
						)}
						{frequency === "15-30" && (
							<div className="flex flex-col">
								<label htmlFor="startDate">Start Date</label>
								<input
									name="startDate"
									className="border-[1px] h-[35px] p-2 rounded-md"
									type="month"
									value={startDate}
									onChange={(e) => {
										console.log(e.currentTarget.value);
										setStartDate(e.currentTarget.value);
									}}
								/>
							</div>
						)}

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
