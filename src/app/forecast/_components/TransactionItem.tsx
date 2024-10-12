import usePreferencesQuery from "@/app/_hooks/usePreferencesQuery";
import { TransactionWithBalance } from "@/lib/types";
import { format } from "date-fns";
import { Dispatch, SetStateAction } from "react";

interface TransactionItemType {
	transaction: TransactionWithBalance;
	isModalOpen: boolean;
	setSelectedTransaction: Dispatch<SetStateAction<TransactionWithBalance>>;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
	balanceRanges: number[];
}

export default function TransactionItem({
	transaction,
	isModalOpen,
	setIsModalOpen,
	setSelectedTransaction,
	balanceRanges,
}: TransactionItemType) {
	const onItemClick = () => {
		setIsModalOpen(!isModalOpen);
		setSelectedTransaction(transaction);
	};

	const { preferences } = usePreferencesQuery();

	const bal = transaction.forecastedBalance;

	const balDanger = bal < balanceRanges[0];
	const balLow = bal > balanceRanges[0] && bal < balanceRanges[1];
	const balMed = bal >= balanceRanges[1] && bal < balanceRanges[2];
	const balHigh = bal >= balanceRanges[2] && bal < balanceRanges[3];
	const balHigher = bal >= balanceRanges[3] && bal < balanceRanges[4];
	const balHighest = bal >= balanceRanges[4];

	const incomeColor = "text-green-600";
	const debtColor = "text-orange-500";
	const savingsColor = "text-blue-500";
	const extraColor = "text-purple-500";

	const type = transaction.type;

	return (
		<div
			className={`
				flex py-1 px-4 border-b-[1px] 
				text-xs
				border-b-black border-opacity-[0.1]
				hover:opacity-[0.8] hover:cursor-pointer
				${balDanger && "bg-gray-500 text-white"}
				${balLow && "bg-red-200"}	
				${balMed && "bg-white"}
				${balHigh && "bg-green-100"}
				${balHigher && "bg-green-200"}
				${balHighest && "bg-green-300"}
				`}
			onClick={onItemClick}
		>
			<div className="flex items-center w-[38%]">
				<p>{transaction.name}</p>
			</div>
			<div className="flex items-center w-[20%]">
				<p>
					{preferences.currency}
					{transaction.amount}
				</p>
			</div>
			<div className="flex items-center w-[20%]">
				<p>{format(transaction.dueDate.toString(), "MMM d, y")}</p>
			</div>
			<div
				className={`
				flex items-center w-[20%] font-bold
				${type === "income" && incomeColor}
				${type === "debt" && debtColor}
				${type === "savings" && savingsColor}
				${type === "extra" && extraColor}`}
			>
				<p>{transaction.type}</p>
			</div>
			<div className="flex items-center w-[20%] font-bold">
				<p>
					{preferences.currency}
					{transaction.forecastedBalance}
				</p>
			</div>
		</div>
	);
}
