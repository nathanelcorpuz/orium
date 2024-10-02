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
	return (
		<div className="flex py-2 px-4 bg-black bg-opacity-[0.05] relative rounded-full">
			<div className="w-[16.65%]">
				<p>{savings.name}</p>
			</div>
			<div className="w-[16.65%]">
				<p>{savings.amount}</p>
			</div>
			<div className="w-[16.65%]">
				<p>{`${savings.day} of every month`}</p>
			</div>
			<div className="w-[16.65%]">
				<p>{format(savings.startDate, "MMM d, yyyy")}</p>
			</div>
			<div className="w-[16.65%]">
				<p>{format(savings.endDate, "MMM d, yyyy")}</p>
			</div>
			<div className="w-[16.65%]">
				<p>{savings.comments}</p>
			</div>
			<div className="absolute right-[1%] flex justify-center items-center top-0 bottom-0">
				<div className="flex">
					<button
						className="p-1 px-4 hover:underline"
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
