"use client";

import { Savings as SavingsType } from "@/lib/types";
import { useState } from "react";
import SavingsItem from "./_components/SavingsItem";
import DeleteModal from "./_components/DeleteModal";
import NewModal from "./_components/NewModal";
import useSavingsQuery from "../_hooks/useSavingsQuery";
import usePreferencesQuery from "../_hooks/usePreferencesQuery";

export default function Savings() {
	const [isNewModalOpen, setIsNewModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedSavings, setSelectedSavings] = useState({} as SavingsType);

	const { totalSavings, savings, isSavingsPending } = useSavingsQuery();
	const { preferences, isPreferencesPending } = usePreferencesQuery();

	return isSavingsPending || isPreferencesPending ? (
		<div className="w-full h-full flex justify-center items-center">
			<p className="text-lg text-slate-400">Loading savings...</p>
		</div>
	) : (
		<div className="flex flex-col p-8 z-[-5]">
			<div className="bg-white flex flex-col w-[1400px] p-5 rounded-lg h-[90vh]">
				<div className="flex gap-[100px] items-center justify-between">
					<div className="flex flex-col py-2">
						<p className="text-sm text-gray-400">Total Remaining Savings</p>
						<p className="text-2xl">
							{preferences.currency}
							{totalSavings.toLocaleString()}
						</p>
					</div>
					<div>
						<button
							className="h-[45px] w-[150px] border-[1px] rounded-md transition-all bg-slate-500 text-white hover:bg-slate-400"
							onClick={() => setIsNewModalOpen(true)}
						>
							Add Savings
						</button>
					</div>
				</div>
				<div className="flex text-sm p-4 border-t-[1px] border-slate-200 text-gray-400">
					<div className="w-[20%]">
						<p>Name</p>
					</div>
					<div className="w-[15%]">
						<p>Amount</p>
					</div>
					<div className="w-[15%]">
						<p>Due Date</p>
					</div>
					<div className="w-[15%]">
						<p>Start Date</p>
					</div>
					<div className="w-[15%]">
						<p>End Date</p>
					</div>
					<div className="w-[20%]">
						<p>Comments</p>
					</div>
				</div>
				<ul className="flex flex-col gap-2 h-[80vh] overflow-auto border-[1px] border-slate-200 rounded-lg">
					{savings.map((savings: SavingsType) => (
						<SavingsItem
							key={savings._id}
							savings={savings}
							setIsDeleteModalOpen={setIsDeleteModalOpen}
							setSelectedSavings={setSelectedSavings}
						/>
					))}
				</ul>
			</div>

			{isDeleteModalOpen ? (
				<DeleteModal
					setIsModalOpen={setIsDeleteModalOpen}
					savings={selectedSavings}
				/>
			) : null}

			{isNewModalOpen ? <NewModal setIsModalOpen={setIsNewModalOpen} /> : null}
		</div>
	);
}
