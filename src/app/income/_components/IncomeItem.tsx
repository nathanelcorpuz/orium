import { Income } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";

interface IncomeItem {
	income: Income;
	setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
	setSelectedIncome: Dispatch<SetStateAction<Income>>;
}

/**
 * 
  name: string;
	amount: number;
	frequency: "monthly" | "bi-weekly" | "weekly";
	dayOfWeek: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun" | "none";
	day: Number;
	comments: string;
 */

export default function IncomeItem({
	income,
	setIsDeleteModalOpen,
	setSelectedIncome,
}: IncomeItem) {
	let formattedDayOfWeek;

	if (income.dayOfWeek == 0) formattedDayOfWeek = "Sunday";
	if (income.dayOfWeek == 1) formattedDayOfWeek = "Monday";
	if (income.dayOfWeek == 2) formattedDayOfWeek = "Tuesday";
	if (income.dayOfWeek == 3) formattedDayOfWeek = "Wednesday";
	if (income.dayOfWeek == 4) formattedDayOfWeek = "Thursday";
	if (income.dayOfWeek == 5) formattedDayOfWeek = "Friday";
	if (income.dayOfWeek == 6) formattedDayOfWeek = "Saturday";

	return (
		<li className="flex py-2 px-4 bg-black bg-opacity-[0.05] relative rounded-full">
			<div className="w-[20%]">
				<p>{income.name}</p>
			</div>
			<div className="w-[20%]">
				<p>{income.amount}</p>
			</div>
			<div className="w-[20%]">
				<p>
					{income.frequency === "monthly"
						? `${income.day} of every month`
						: `${formattedDayOfWeek} ${income.frequency}`}
				</p>
			</div>
			<div className="w-[20%]">
				<p>{income.comments}</p>
			</div>
			<div className="absolute right-[20%] flex justify-center items-center top-0 bottom-0">
				<div className="flex">
					<button
						className="p-1 px-4 hover:underline"
						onClick={() => {
							setIsDeleteModalOpen(true);
							setSelectedIncome(income);
						}}
					>
						Delete
					</button>
				</div>
			</div>
		</li>
	);
}
