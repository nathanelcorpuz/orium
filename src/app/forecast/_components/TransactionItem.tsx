import { TransactionWithBalance } from "@/lib/types";
import { format } from "date-fns";
import { Dispatch, SetStateAction } from "react";

interface TransactionItemType {
	transaction: TransactionWithBalance;
	isModalOpen: boolean;
	setSelectedTransaction: Dispatch<SetStateAction<TransactionWithBalance>>;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function TransactionItem({
	transaction,
	isModalOpen,
	setIsModalOpen,
	setSelectedTransaction,
}: TransactionItemType) {
	const onItemClick = () => {
		setIsModalOpen(!isModalOpen);
		setSelectedTransaction(transaction);
	};

	const bal = transaction.forecastedBalance;

	const balNegative = bal < 0;
	const balLow = bal > 0 && bal < 10000;
	const balMed = bal >= 10000 && bal < 50000;
	const balHigh = bal >= 50000 && bal < 100000;
	const balHigher = bal >= 100000 && bal < 150000;
	const balHighest = bal >= 150000 && bal < 200000;
	const balExtreme = bal >= 200000;

	const incomeColor = "text-green-600";
	const debtColor = "text-orange-500";
	const savingsColor = "text-blue-500";
	const extraColor = "text-purple-500";

	const type = transaction.type;

	return (
		<div
			className={`
				flex py-1 px-4 border-b-[1px] 
				text-xs font-semibold
				border-b-black border-opacity-[0.1]
				hover:opacity-[0.8] hover:cursor-pointer
				${balNegative && "bg-black text-white"}
				${balLow && "bg-red-200"}	
				${balMed && "bg-yellow-100"}	
				${balHigh && "bg-white"}
				${balHigher && "bg-green-100"}
				${balHighest && "bg-green-200"}
				${balExtreme && "bg-blue-200"}
				${type === "income" && incomeColor}
				${type === "debt" && debtColor}
				${type === "savings" && savingsColor}
				${type === "extra" && extraColor}
				`}
			onClick={onItemClick}
		>
			<div className="w-[19%]">
				<p>{transaction.name}</p>
			</div>
			<div className="w-[19%]">
				<p>{transaction.amount}</p>
			</div>
			<div className="w-[19%]">
				<p>{format(transaction.dueDate.toString(), "MMM d, y")}</p>
			</div>
			<div className="w-[19%]">
				<p>{transaction.type}</p>
			</div>
			<div className="w-[19%]">
				<p>{transaction.forecastedBalance}</p>
			</div>
		</div>
	);
}
