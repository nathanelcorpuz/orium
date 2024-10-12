"use client";

import url from "@/lib/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { APIResult } from "@/lib/types";

interface CurrencyModal {
	setModalOpen: Dispatch<SetStateAction<boolean>>;
	currentCurrency: string;
}

export default function CurrencyModal({
	setModalOpen,
	currentCurrency,
}: CurrencyModal) {
	const [currency, setCurrency] = useState(currentCurrency);
	const [error, setError] = useState("");

	const queryClient = useQueryClient();

	interface FormData {
		currency: string;
	}

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/preferences`, {
				method: "PUT",
				body: JSON.stringify(formData),
			}).then(async (res) => {
				return res.json();
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["preferences"] });
		},
	});

	const onSubmit = async () => {
		if (!currency) {
			setError("Choose an option");
		} else setError("");

		const result: APIResult = await mutation.mutateAsync({ currency });

		if (result.success) {
			setModalOpen(false);
		}
	};

	return (
		<div className="z-[2] absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
			<div className="bg-black opacity-25 w-[100%] h-[100%] absolute"></div>
			<div className="w-[500px] bg-white z-[2] flex flex-col p-8 gap-8 rounded-2xl">
				<h1 className="text-2xl">Set Currency</h1>
				<div className="border-b-[1px] border-slate-200"></div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-1">
							<div className="flex flex-col">
								<label className="text-sm text-gray-400" htmlFor="currency">
									Currency
								</label>
								<select
									name="currency"
									id="currency"
									value={currency}
									onChange={(e) => setCurrency(e.currentTarget.value)}
									className="border border-opacity-[0.1] rounded-lg p-2"
								>
									<option value="">-Choose an option-</option>
									<option value="₱">₱ Peso</option>
									<option value="$">$ Dollar</option>
									<option value="€">€ Euro</option>
									<option value="¥">¥ Yen</option>
									<option value="د.إ">د.إ Dirham</option>
									<option value="₩">₩ Won</option>
								</select>
							</div>
							{error && <p className="text-red-500">{error}</p>}
						</div>
					</div>
					<div className="flex mt-auto justify-between">
						<button
							disabled={mutation.isPending}
							className={`h-[45px] w-[150px] border-[1px] rounded-md transition-all bg-slate-500 text-white hover:bg-slate-400 ${
								mutation.isPending ? "opacity-[0.5]" : "opacity-100"
							}`}
							onClick={() => setModalOpen(false)}
						>
							Close
						</button>
						<button
							disabled={mutation.isPending}
							className={`h-[45px] w-[150px] border-[1px] rounded-md transition-all bg-slate-500 text-white hover:bg-slate-400 ${
								mutation.isPending ? "opacity-[0.5]" : "opacity-100"
							}`}
							onClick={onSubmit}
						>
							Submit
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
