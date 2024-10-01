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
		<div className="flex py-2 px-4 bg-black bg-opacity-[0.05] relative rounded-full">
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
			<div className="absolute right-[20%] flex justify-center items-center top-0 bottom-0">
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
