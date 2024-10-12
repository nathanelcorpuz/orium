"use client";

import usePreferencesQuery from "@/app/_hooks/usePreferencesQuery";
import url from "@/lib/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";

interface NewModal {
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function NewModal({ setIsModalOpen }: NewModal) {
	const queryClient = useQueryClient();

	const { preferences } = usePreferencesQuery();

	const [name, setName] = useState("");
	const [amount, setAmount] = useState("");
	const [day, setDay] = useState("");
	const [frequency, setFrequency] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [comments, setComments] = useState("");
	const [error, setError] = useState("");

	interface FormData {
		name: string;
		amount: number;
		day: number;
		endDate: Date;
		frequency: string;
		startDate: string;
		comments?: string;
	}

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/income`, {
				method: "POST",
				body: JSON.stringify(formData),
			}).then((res) => {
				return res.json();
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["income"] });
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});

	const onClickClose = () => setIsModalOpen(false);
	const onClickSubmit = async () => {
		const res = await mutation.mutateAsync({
			name,
			amount: Number(amount),
			day: Number(day),
			endDate: new Date(endDate),
			frequency,
			startDate,
			comments,
		});

		if (!res.success) setError(res.message);
		if (res.success) setIsModalOpen(false);
	};

	return (
		<div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
			<div className="bg-black opacity-25 w-[100%] h-[100%] absolute"></div>
			<div className="w-[500px] bg-white flex flex-col p-8 gap-8 rounded-2xl z-10">
				<div className="flex flex-col py-4 gap-4">
					<div className="flex flex-col gap-6">
						<h1 className="text-2xl">New Income</h1>
						<div className="border-b-[1px] border-slate-200"></div>
						<div className="flex flex-col">
							<label className="text-sm text-gray-400" htmlFor="name">
								Name
							</label>
							<input
								name="name"
								className="border-[1px] h-[35px] p-2 rounded-md"
								value={name}
								onChange={(e) => setName(e.currentTarget.value)}
							/>
						</div>
						<div className="flex flex-col">
							<label className="text-sm text-gray-400" htmlFor="amount">
								Amount {"("}
								{preferences.currency}
								{")"}
							</label>
							<input
								name="amount"
								className="border-[1px] h-[35px] p-2 rounded-md"
								type="text"
								value={amount}
								onChange={(e) => setAmount(e.currentTarget.value)}
							/>
						</div>
						<div className="flex flex-col">
							<label className="text-sm text-gray-400" htmlFor="frequency">
								Frequency
							</label>
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
								<label className="text-sm text-gray-400" htmlFor="day">
									Day (1-30)
								</label>
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
								<label className="text-sm text-gray-400" htmlFor="startDate">
									Start Date
								</label>
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
								<label className="text-sm text-gray-400" htmlFor="startDate">
									Start Date
								</label>
								<input
									name="startDate"
									className="border-[1px] h-[35px] p-2 rounded-md"
									type="month"
									value={startDate}
									onChange={(e) => {
										setStartDate(e.currentTarget.value);
									}}
								/>
							</div>
						)}

						<div className="flex flex-col">
							<label className="text-sm text-gray-400" htmlFor="endDate">
								Track Until
							</label>
							<input
								name="endDate"
								className="border-[1px] h-[35px] p-2 rounded-md"
								type="month"
								value={endDate}
								onChange={(e) => setEndDate(e.currentTarget.value)}
							/>
						</div>
						<div className="flex flex-col">
							<label className="text-sm text-gray-400" htmlFor="comments">
								Comments
							</label>
							<textarea
								maxLength={150}
								name="comments"
								className="border-[1px] h-[100px] p-2 rounded-md resize-none"
								value={comments}
								onChange={(e) => setComments(e.currentTarget.value)}
							/>
						</div>
						<div className="flex mt-auto justify-between">
							<button
								disabled={mutation.isPending}
								className={`
          h-[45px] w-[150px] border-[1px] rounded-md transition-all bg-slate-500 text-white hover:bg-slate-400
					${mutation.isPending ? "opacity-[0.5]" : "opacity-100"}
					`}
								onClick={onClickClose}
							>
								Close
							</button>
							<button
								disabled={mutation.isPending}
								className={`
          h-[45px] w-[150px] border-[1px] rounded-md transition-all bg-slate-500 text-white hover:bg-slate-400
					${mutation.isPending ? "opacity-[0.5]" : "opacity-100"}
					`}
								onClick={onClickSubmit}
							>
								Submit
							</button>
						</div>
						{error && <p className="text-red-500">{error}</p>}
					</div>
				</div>
			</div>
		</div>
	);
}
