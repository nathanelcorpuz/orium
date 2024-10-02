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
	return (
		<div className="flex py-2 px-4 bg-black bg-opacity-[0.05] relative rounded-full">
			<div className="w-[16.65%]">
				<p>{debt.name}</p>
			</div>
			<div className="w-[16.65%]">
				<p>{debt.amount}</p>
			</div>
			<div className="w-[16.65%]">
				<p>{`${debt.day} of every month`}</p>
			</div>
			<div className="w-[16.65%]">
				<p>{format(debt.startDate, "MMM d, yyyy")}</p>
			</div>
			<div className="w-[16.65%]">
				<p>{format(debt.endDate, "MMM d, yyyy")}</p>
			</div>
			<div className="w-[16.65%]">
				<p>{debt.comments}</p>
			</div>
			<div className="absolute right-[1%] flex justify-center items-center top-0 bottom-0">
				<div className="flex">
					<button
						className="p-1 px-4 hover:underline"
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
