"use client";

import { Balance } from "@/lib/types";
import { useState } from "react";
import NewModal from "./_components/NewModal";
import BalanceItem from "./_components/BalanceItem";
import DeleteModal from "./_components/DeleteModal";
import EditModal from "./_components/EditModal";
import useBalancesQuery from "../_hooks/useBalancesQuery";
import usePreferencesQuery from "../_hooks/usePreferencesQuery";

export default function Balances() {
	const [isNewModalOpen, setIsNewModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedBalance, setSelectedBalance] = useState({} as Balance);

	const { balances, balancePending, totalBalance } = useBalancesQuery();

	const { preferences, isPreferencesPending } = usePreferencesQuery();

	return balancePending || isPreferencesPending ? (
		<div className="w-full h-full flex justify-center items-center">
			<p className="text-lg text-slate-400">Loading balances...</p>
		</div>
	) : (
		<div className="flex flex-col p-8 z-[-5]">
			<div className="bg-white flex flex-col w-[1000px] p-5 rounded-lg h-[90vh]">
				<div className="flex gap-[100px] items-center justify-between">
					<div className="flex flex-col py-2">
						<p className="text-sm text-gray-400">Total Balance</p>
						<p className="text-2xl">
							{preferences.currency}
							{totalBalance}
						</p>
					</div>
					<div>
						<button
							className="h-[45px] w-[150px] border-[1px] rounded-md transition-all bg-slate-500 text-white hover:bg-slate-400"
							onClick={() => setIsNewModalOpen(true)}
						>
							Add Balance
						</button>
					</div>
				</div>
				<div className="flex text-sm p-4 border-t-[1px] border-slate-200 text-gray-400">
					<div className="w-[20%]">
						<p>Name</p>
					</div>
					<div className="w-[20%]">
						<p>Amount</p>
					</div>
					<div className="w-[20%]">
						<p>Comments</p>
					</div>
				</div>
				<ul className="flex flex-col gap-2 h-[80vh] overflow-auto border-[1px] border-slate-200 rounded-lg">
					{balances.map((balance: Balance) => (
						<BalanceItem
							key={balance._id}
							balance={balance}
							setIsDeleteModalOpen={setIsDeleteModalOpen}
							setIsEditModalOpen={setIsEditModalOpen}
							setSelectedBalance={setSelectedBalance}
						/>
					))}
				</ul>
			</div>

			{isDeleteModalOpen ? (
				<DeleteModal
					setIsModalOpen={setIsDeleteModalOpen}
					balance={selectedBalance}
				/>
			) : null}

			{isEditModalOpen ? (
				<EditModal
					setIsModalOpen={setIsEditModalOpen}
					balance={selectedBalance}
				/>
			) : null}

			{isNewModalOpen ? <NewModal setIsModalOpen={setIsNewModalOpen} /> : null}
		</div>
	);
}
