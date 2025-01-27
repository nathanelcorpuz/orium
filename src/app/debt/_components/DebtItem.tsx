"use client";

import usePreferencesQuery from "@/app/_hooks/usePreferencesQuery";
import { Debt } from "@/lib/types";
import { format } from "date-fns";
import { Dispatch, SetStateAction } from "react";

interface DebtItem {
	debt: Debt;
	setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
	setSelectedDebt: Dispatch<SetStateAction<Debt>>;
}

export default function DebtItem({
	debt,
	setIsDeleteModalOpen,
	setSelectedDebt,
}: DebtItem) {
	const { preferences } = usePreferencesQuery();
	return (
		<div className="flex py-1 px-4 border-b-[1px] border-slate-200 text-sm">
			<div className="flex items-center w-[22%]">
				<p>{debt.name}</p>
			</div>
			<div className="flex items-center w-[16.65%]">
				<p>
					{preferences.currency}
					{debt.amount.toLocaleString()}
				</p>
			</div>
			<div className="flex items-center w-[16.65%]">
				<p>{`${debt.day} of every month`}</p>
			</div>
			<div className="flex items-center w-[16.65%]">
				<p>{format(debt.startDate, "MMM d, yyyy")}</p>
			</div>
			<div className="flex items-center w-[16.65%]">
				<p>{format(debt.endDate, "MMM d, yyyy")}</p>
			</div>
			<div className="flex items-center w-[16.65%]">
				<p>{debt.comments}</p>
			</div>
			<div className="ml-auto">
				<div className="flex">
					<button
						className="p-1 px-4 hover:underline text-sm text-slate-400"
						onClick={() => {
							setIsDeleteModalOpen(true);
							setSelectedDebt(debt);
						}}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}
