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

	return (
		<div
			className="flex py-2 px-4 border-b-[1px] border-b-black border-opacity-[0.1] hover:bg-slate-50 hover:cursor-pointer"
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
