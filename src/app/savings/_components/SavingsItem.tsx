"use client";

import usePreferencesQuery from "@/app/_hooks/usePreferencesQuery";
import { Savings } from "@/lib/types";
import { format } from "date-fns";
import { Dispatch, SetStateAction } from "react";

interface SavingsItem {
	savings: Savings;
	setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
	setSelectedSavings: Dispatch<SetStateAction<Savings>>;
}

export default function SavingsItem({
	savings,
	setIsDeleteModalOpen,
	setSelectedSavings,
}: SavingsItem) {
	const { preferences } = usePreferencesQuery();

	return (
		<div className="flex py-1 px-4 border-b-[1px] border-slate-200 text-sm">
			<div className="flex items-center w-[22%]">
				<p>{savings.name}</p>
			</div>
			<div className="flex items-center w-[16.65%]">
				<p>
					{preferences.currency}
					{savings.amount}
				</p>
			</div>
			<div className="flex items-center w-[16.65%]">
				<p>{`${savings.day} of every month`}</p>
			</div>
			<div className="flex items-center w-[16.65%]">
				<p>{format(savings.startDate, "MMM d, yyyy")}</p>
			</div>
			<div className="flex items-center w-[16.65%]">
				<p>{format(savings.endDate, "MMM d, yyyy")}</p>
			</div>
			<div className="flex items-center w-[16.65%]">
				<p>{savings.comments}</p>
			</div>
			<div className="ml-auto">
				<div className="flex">
					<button
						className="p-1 px-4 hover:underline text-sm text-slate-400"
						onClick={() => {
							setIsDeleteModalOpen(true);
							setSelectedSavings(savings);
						}}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}
