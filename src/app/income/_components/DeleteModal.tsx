"use client";
import { APIResult, Income } from "@/lib/types";
import url from "@/lib/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";

interface DeleteModal {
	income: Income;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DeleteModal({ income, setIsModalOpen }: DeleteModal) {
	let formattedDayOfWeek;
	if (income.dayOfWeek == 0) formattedDayOfWeek = "Sunday";
	if (income.dayOfWeek == 1) formattedDayOfWeek = "Monday";
	if (income.dayOfWeek == 2) formattedDayOfWeek = "Tuesday";
	if (income.dayOfWeek == 3) formattedDayOfWeek = "Wednesday";
	if (income.dayOfWeek == 4) formattedDayOfWeek = "Thursday";
	if (income.dayOfWeek == 5) formattedDayOfWeek = "Friday";
	if (income.dayOfWeek == 6) formattedDayOfWeek = "Saturday";

	const [error, setError] = useState("");

	const queryClient = useQueryClient();

	interface FormData {
		_id: string;
	}

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/income`, {
				method: "DELETE",
				body: JSON.stringify(formData),
			}).then((res) => res.json()),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["income"] });
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});

	const onClickClose = () => {
		setIsModalOpen(false);
	};
	const onClickSubmit = async () => {
		const res: APIResult = await mutation.mutateAsync({ _id: income._id });
		if (!res.success) setError(res.message);
		if (res.success) setIsModalOpen(false);
	};
	return (
		<div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
			<div className="bg-black opacity-25 w-[100%] h-[100%] absolute"></div>
			<div className="w-[500px] bg-white z-[99] flex flex-col p-8 gap-8 rounded-2xl">
				<div className="flex flex-col py-4 gap-4">
					<div className="flex flex-col gap-6">
						<h1 className="text-2xl">Delete Income</h1>
						<p className="text-sm text-slate-400">
							This will delete all related transactions.
						</p>
						<div className="border-b-[1px] border-slate-200"></div>
						<div className="flex flex-col">
							<p className="text-sm text-slate-400">Name</p>
							<p>{income.name}</p>
						</div>
						<div className="flex flex-col">
							<p className="text-sm text-slate-400">Amount</p>
							<p>{income.amount}</p>
						</div>
						<div className="flex flex-col">
							<p className="text-sm text-slate-400">Frequency</p>
							<p>
								{income.frequency === "monthly"
									? `${income.day} of every month`
									: income.frequency === "weekly" ||
									  income.frequency === "bi-weekly"
									? `${formattedDayOfWeek} ${income.frequency}`
									: `15th & 30th`}
							</p>
						</div>
						<div className="flex flex-col">
							<p className="text-sm text-slate-400">Comments</p>
							<p>{income.comments}</p>
						</div>
						<div className="flex mt-auto justify-between">
							<button
								disabled={mutation.isPending}
								className={`
          py-3 bg-[#202020] text-white rounded-lg
          w-[100%] hover:bg-[#505050] transition-all
					${mutation.isPending ? "opacity-[0.5]" : "opacity-100"}
					`}
								onClick={onClickClose}
							>
								Close
							</button>
							<button
								disabled={mutation.isPending}
								className={`
          py-3 bg-[#202020] text-white rounded-lg
          w-[100%] hover:bg-[#505050] transition-all
					${mutation.isPending ? "opacity-[0.5]" : "opacity-100"}
					`}
								onClick={onClickSubmit}
							>
								Submit
							</button>
						</div>
						{error && <p className="text-red-600">{error}</p>}
					</div>
				</div>
			</div>
		</div>
	);
}
