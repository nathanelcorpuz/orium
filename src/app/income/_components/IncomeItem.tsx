import { Income } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";

interface IncomeItem {
	income: Income;
	setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
	setSelectedIncome: Dispatch<SetStateAction<Income>>;
}

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
		<li className="flex py-1 px-4 border-b-[1px] border-slate-200">
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
						: income.frequency === "15-30"
						? `15th & 30th`
						: `${formattedDayOfWeek} ${income.frequency}`}
				</p>
			</div>
			<div className="w-[20%]">
				<p>{income.comments}</p>
			</div>
			<div className="ml-auto">
				<div className="flex">
					<button
						className="p-1 px-4 hover:underline text-sm text-slate-400"
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
