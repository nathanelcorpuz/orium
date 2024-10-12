"use client";
import usePreferencesQuery from "@/app/_hooks/usePreferencesQuery";
import { Bill } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";

interface BillItem {
	bill: Bill;
	setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
	setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
	setSelectedBill: Dispatch<SetStateAction<Bill>>;
}

export default function BillItem({
	bill,
	setIsEditModalOpen,
	setIsDeleteModalOpen,
	setSelectedBill,
}: BillItem) {
	const { preferences } = usePreferencesQuery();
	return (
		<div className="flex py-1 px-4 border-b-[1px] border-slate-200 text-sm">
			<div className="w-[20%] flex items-center">
				<p>{bill.name}</p>
			</div>
			<div className="w-[20%] flex items-center">
				<p>
					{preferences.currency}
					{bill.amount}
				</p>
			</div>
			<div className="w-[20%] flex items-center">
				<p>{bill.day}</p>
			</div>
			<div className="w-[20%] flex items-center">
				<p>{bill.comments}</p>
			</div>
			<div className="ml-auto">
				<div className="flex">
					<button
						className="p-1 px-4 hover:underline text-sm text-slate-400"
						onClick={() => {
							setIsEditModalOpen(true);
							setSelectedBill(bill);
						}}
					>
						Edit
					</button>
					<button
						className="p-1 px-4 hover:underline text-sm text-slate-400"
						onClick={() => {
							setIsDeleteModalOpen(true);
							setSelectedBill(bill);
						}}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}
