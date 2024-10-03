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
	return (
		<div className="flex py-2 px-4 bg-black bg-opacity-[0.05] relative rounded-full">
			<div className="w-[20%]">
				<p>{balance.name}</p>
			</div>
			<div className="w-[20%]">
				<p>{balance.amount}</p>
			</div>
			<div className="w-[20%]">
				<p>{balance.comments}</p>
			</div>
			<div className="absolute right-[20%] flex justify-center items-center top-0 bottom-0">
				<div className="flex">
					<button
						className="p1 px-4 hover:underline"
						onClick={() => {
							setIsEditModalOpen(true);
							setSelectedBalance(balance);
						}}
					>
						Edit
					</button>
					<button
						className="p-1 px-4 hover:underline"
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
