"use client";

import usePreferencesQuery from "@/app/_hooks/usePreferencesQuery";
import { APIResult, Bill } from "@/lib/types";
import url from "@/lib/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";

interface EditModal {
	bill: Bill;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EditModal({ bill, setIsModalOpen }: EditModal) {
	const [name, setName] = useState(bill.name);
	const [amount, setAmount] = useState(String(bill.amount));
	const [day, setDay] = useState(String(bill.day));
	const [comments, setComments] = useState(bill.comments);

	const [error, setError] = useState("");

	const queryClient = useQueryClient();

	const { preferences } = usePreferencesQuery();

	interface FormData {
		_id: string;
		name: string;
		amount: number;
		day: number;
		comments?: string;
	}

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/bills`, {
				method: "PUT",
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
		const res: APIResult = await mutation.mutateAsync({
			_id: bill._id,
			name,
			amount: Number(amount),
			day: Number(day),
			comments: comments || "",
		});

		if (!res.success) setError(res.message);
		if (res.success) setIsModalOpen(false);
	};

	return (
		<div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
			<div className="bg-black opacity-25 w-[100%] h-[100%] absolute"></div>
			<div className="w-[500px] bg-white flex flex-col p-8 gap-8 rounded-2xl z-[99]">
				<div className="flex flex-col py-4 gap-4 ">
					<div className="flex flex-col gap-6">
						<h1 className="text-2xl">Edit Bill</h1>
						<p className="text-sm text-slate-500">
							This will edit all related transactions.
						</p>
						<div className="border-b-[1px] border-slate-200"></div>
						<div className="flex flex-col">
							<label className="text-sm text-slate-400" htmlFor="name">
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
							<label className="text-sm text-slate-400" htmlFor="amount">
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
							<label className="text-sm text-slate-400" htmlFor="day">
								Monthly Due Date
							</label>
							<input
								name="day"
								className="border-[1px] h-[35px] p-2 rounded-md"
								type="text"
								value={day}
								onChange={(e) => setDay(e.currentTarget.value)}
							/>
						</div>
						<div className="flex flex-col">
							<label className="text-sm text-slate-400" htmlFor="comments">
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
						{error && <p className="text-red-600">{error}</p>}
					</div>
				</div>
			</div>
		</div>
	);
}
