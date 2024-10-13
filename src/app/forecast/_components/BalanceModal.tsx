"use client";

import useBalanceEditMutation from "@/app/_hooks/useBalanceEditMutation";
import { Balance } from "@/lib/types";
import { Dispatch, SetStateAction, useState } from "react";

interface BalanceModal {
	balance: Balance;
	currency: string;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function BalanceModal({
	balance,
	currency,
	setIsModalOpen,
}: BalanceModal) {
	const [newBalanceAmount, setNewBalanceAmount] = useState(
		String(balance.amount)
	);

	const mutation = useBalanceEditMutation();

	return (
		<div className="z-[2] absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
			<div className="bg-black opacity-25 w-[100%] h-[100%] absolute"></div>
			<div className="w-[500px] bg-white z-[2] flex flex-col p-8 gap-8 rounded-2xl">
				<h1 className="text-2xl">Edit Balance</h1>
				<div className="border-b-[1px] border-slate-200"></div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-4">
						<div className="flex gap-4">
							<div className="w-full border-[1px] rounded-md p-3">
								<p className="text-sm text-slate-400 capitalize">
									{balance.name}
								</p>
								<p>
									{currency}
									{balance.amount.toLocaleString()}
								</p>
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<label
							htmlFor="newBalanceAmount"
							className="text-sm text-slate-400"
						>
							New Balance Amount
						</label>
						<input
							id="newBalanceAmount"
							name="newBalanceAmount"
							type="text"
							className="border rounded-md h-[35px] p-2"
							value={newBalanceAmount}
							onChange={(e) => setNewBalanceAmount(e.target.value)}
						/>
					</div>
				</div>
				<div className="flex mt-auto justify-between">
					<button
						onClick={() => {
							setIsModalOpen(false);
						}}
						disabled={mutation.isPending}
						className={`
          h-[45px] w-[150px] border-[1px] rounded-md transition-all bg-slate-500 text-white hover:bg-slate-400
					${mutation.isPending ? "opacity-[0.5]" : "opacity-100"}
					`}
					>
						Close
					</button>
					<button
						disabled={mutation.isPending}
						className={`
          h-[45px] w-[150px] border-[1px] rounded-md transition-all bg-slate-500 text-white hover:bg-slate-400
					${mutation.isPending ? "opacity-[0.5]" : "opacity-100"}
					`}
						onClick={async () => {
							const result = await mutation.mutateAsync({
								_id: balance._id,
								name: balance.name,
								amount: Number(newBalanceAmount),
							});

							if (result.success) setIsModalOpen(false);
						}}
					>
						Submit
					</button>
				</div>
			</div>
		</div>
	);
}
