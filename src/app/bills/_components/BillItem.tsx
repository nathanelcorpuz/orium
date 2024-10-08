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
	return (
		<div className="flex py-2 px-4 border-b-[1px] border-slate-300 relative">
			<div className="w-[20%]">
				<p>{bill.name}</p>
			</div>
			<div className="w-[20%]">
				<p>{bill.amount}</p>
			</div>
			<div className="w-[20%]">
				<p>{bill.day}</p>
			</div>
			<div className="w-[20%]">
				<p>{bill.comments}</p>
			</div>
			<div className="ml-auto">
				<div className="flex">
					<button
						className="p1 px-4 hover:underline"
						onClick={() => {
							setIsEditModalOpen(true);
							setSelectedBill(bill);
						}}
					>
						Edit
					</button>
					<button
						className="p-1 px-4 hover:underline"
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
