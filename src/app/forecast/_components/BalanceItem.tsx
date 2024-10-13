import { Balance } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";

interface BalanceItem {
	balance: Balance;
	currency: string;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
	setSelectedBalance: Dispatch<SetStateAction<Balance>>;
}

export default function BalanceItem({
	balance,
	currency,
	setIsModalOpen,
	setSelectedBalance,
}: BalanceItem) {
	return (
		<div
			className="min-w-[70px] flex flex-col p-2 rounded-lg hover:bg-slate-200 transition-all cursor-pointer"
			onClick={() => {
				setIsModalOpen(true);
				setSelectedBalance(balance);
			}}
		>
			<p className="text-slate-400 text-sm">{balance.name}</p>
			<p className="text-slate-400 text-sm">
				{currency}
				{balance.amount.toLocaleString()}
			</p>
		</div>
	);
}
