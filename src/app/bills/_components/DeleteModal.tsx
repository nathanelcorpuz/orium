"use client";
import usePreferencesQuery from "@/app/_hooks/usePreferencesQuery";
import { APIResult, Bill } from "@/lib/types";
import url from "@/lib/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";

interface DeleteModal {
	bill: Bill;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DeleteModal({ bill, setIsModalOpen }: DeleteModal) {
	const queryClient = useQueryClient();
	const [error, setError] = useState("");

	const { preferences } = usePreferencesQuery();

	interface FormData {
		_id: string;
	}

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/bills`, {
				method: "DELETE",
				body: JSON.stringify(formData),
			}).then((res) => res.json()),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["bills"] });
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});

	const onClickClose = () => {
		setIsModalOpen(false);
	};
	const onClickSubmit = async () => {
		const res: APIResult = await mutation.mutateAsync({ _id: bill._id });
		if (!res.success) setError(res.message);
		if (res.success) setIsModalOpen(false);
	};
	return (
		<div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
			<div className="bg-black opacity-25 w-[100%] h-[100%] absolute"></div>
			<div className="w-[500px] bg-white flex flex-col p-8 gap-8 rounded-2xl z-[99]">
				<div className="flex flex-col py-4 gap-4">
					<div className="flex flex-col gap-6">
						<h1 className="text-2xl">Delete Bill</h1>
						<p className="text-sm text-slate-400">
							This will delete all related transactions.
						</p>
						<div className="border-b-[1px] border-slate-200"></div>
						<div className="flex flex-col">
							<p className="text-sm text-slate-400">Name</p>
							<p>{bill.name}</p>
						</div>
						<div className="flex flex-col">
							<p className="text-sm text-slate-400">Amount</p>
							<p>
								{preferences.currency}
								{bill.amount.toLocaleString()}
							</p>
						</div>
						<div className="flex flex-col">
							<p className="text-sm text-slate-400">Monthly Due Date</p>
							<p>{bill.day}</p>
						</div>
						<div className="flex flex-col">
							<p className="text-sm text-slate-400">Comments</p>
							<p>{bill.comments}</p>
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
						{error && <p className="text-red-600">{error}</p>}
					</div>
				</div>
			</div>
		</div>
	);
}
