"use client";
import { APIResult, Savings } from "@/lib/types";
import url from "@/lib/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Dispatch, SetStateAction, useState } from "react";

interface DeleteModal {
	savings: Savings;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DeleteModal({ savings, setIsModalOpen }: DeleteModal) {
	const queryClient = useQueryClient();
	const [error, setError] = useState("");

	interface FormData {
		_id: string;
	}

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/savings`, {
				method: "DELETE",
				body: JSON.stringify(formData),
			}).then((res) => res.json()),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["savings"] });
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});

	const onClickClose = () => {
		setIsModalOpen(false);
	};
	const onClickSubmit = async () => {
		const result: APIResult = await mutation.mutateAsync({ _id: savings._id });
		if (!result.success) setError(result.message);
		if (result.success) setIsModalOpen(false);
	};
	return (
		<div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
			<div className="bg-black opacity-25 w-[100%] h-[100%] absolute"></div>
			<div className="w-[500px] bg-white z-[99] flex flex-col p-8 gap-8 rounded-2xl">
				<div className="flex flex-col py-4 gap-4">
					<div className="flex flex-col gap-6">
						<h1 className="text-2xl">Delete Savings</h1>
						<p className="text-sm text-slate-400">
							This will delete all related transactions.
						</p>
						<div className="border-b-[1px] border-slate-200"></div>
						<div className="flex flex-col">
							<p className="text-sm text-slate-400">Name</p>
							<p>{savings.name}</p>
						</div>
						<div className="flex flex-col">
							<p className="text-sm text-slate-400">Amount</p>
							<p>{savings.amount}</p>
						</div>
						<div className="flex flex-col">
							<p className="text-sm text-slate-400">Day of Month</p>
							<p>{savings.day}</p>
						</div>
						<div className="flex flex-col">
							<p className="text-sm text-slate-400">Start Date</p>
							<p>{format(savings.startDate, "MMM d, yyyy")}</p>
						</div>
						<div className="flex flex-col">
							<p className="text-sm text-slate-400">End Date</p>
							<p>{format(savings.endDate, "MMM d, yyyy")}</p>
						</div>
						<div className="flex flex-col">
							<p className="text-sm text-slate-400">Comments</p>
							<p>{savings.comments}</p>
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
