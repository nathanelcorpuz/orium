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
	const balHighest = bal >= 150000;
	const balExtreme = bal >= 200000;

	return (
		<div
			className={`
				flex py-2 px-4 border-b-[1px]
				border-b-black border-opacity-[0.1]
				hover:opacity-[0.8] hover:cursor-pointer
				${balNegative && "bg-black text-white"}
				${balLow && "bg-red-200"}	
				${balMed && "bg-yellow-100"}	
				${balHigh && "bg-white"}
				${balHigher && "bg-green-100"}
				${balHighest && "bg-green-200"}
				${balExtreme && "bg-blue-200"}
				`}
			onClick={onItemClick}
		>
			<div className="w-[20%]">
				<p>{transaction.name}</p>
			</div>
			<div className="w-[20%]">
				<p>{transaction.amount}</p>
			</div>
			<div className="w-[20%]">
				<p>{format(transaction.dueDate.toString(), "MMM d, y")}</p>
			</div>
			<div className="w-[20%]">
				<p>{transaction.type}</p>
			</div>
			<div className="w-[20%]">
				<p>{transaction.forecastedBalance}</p>
			</div>
		</div>
	);
}
