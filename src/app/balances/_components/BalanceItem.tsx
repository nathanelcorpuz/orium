import usePreferencesQuery from "@/app/_hooks/usePreferencesQuery";
import { Balance } from "@/lib/types";
import { Dispatch, SetStateAction } from "react";

interface BalanceItem {
	balance: Balance;
	setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
	setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
	setSelectedBalance: Dispatch<SetStateAction<Balance>>;
}

export default function BalanceItem({
	balance,
	setIsEditModalOpen,
	setIsDeleteModalOpen,
	setSelectedBalance,
}: BalanceItem) {
	const { preferences } = usePreferencesQuery();
	return (
		<div className="flex py-1 px-4 border-b-[1px] border-slate-200 text-sm">
			<div className="w-[20%] flex items-center">
				<p>{balance.name}</p>
			</div>
			<div className="w-[20%] flex items-center">
				<p>
					{preferences.currency}
					{balance.amount}
				</p>
			</div>
			<div className="w-[20%] flex items-center">
				<p>{balance.comments}</p>
			</div>
			<div className="ml-auto">
				<div className="flex">
					<button
						className="p-1 px-4 hover:underline text-sm text-slate-400"
						onClick={() => {
							setIsEditModalOpen(true);
							setSelectedBalance(balance);
						}}
					>
						Edit
					</button>
					<button
						className="p-1 px-4 hover:underline text-sm text-slate-400"
						onClick={() => {
							setIsDeleteModalOpen(true);
							setSelectedBalance(balance);
						}}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}
