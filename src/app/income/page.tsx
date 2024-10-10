"use client";

import { Income } from "@/lib/types";
import { useState } from "react";
import IncomeItem from "./_components/IncomeItem";
import NewModal from "./_components/NewModal";
import DeleteModal from "./_components/DeleteModal";
import useIncomeQuery from "../_hooks/useIncomeQuery";

export default function IncomePage() {
	const [isNewModalOpen, setIsNewModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedIncome, setSelectedIncome] = useState({} as Income);

	const { incomes, incomePending, totalMonthlyIncome } = useIncomeQuery();

	return incomePending ? (
		<div className="w-full h-full flex justify-center items-center">
			<p className="text-lg text-slate-400">Loading income...</p>
		</div>
	) : (
		<div className="flex flex-col p-8 z-[-5]">
			<div className="bg-white flex flex-col w-[1000px] p-5 rounded-lg h-[90vh]">
				<div className="flex gap-[100px] items-center justify-between">
					<div className="flex flex-col py-2">
						<p className="text-sm text-gray-400">Total Monthly Income</p>
						<p className="text-2xl">₱{totalMonthlyIncome}</p>
					</div>
					<div>
						<button
							className="h-[45px] w-[150px] border-[1px] rounded-md transition-all bg-slate-500 text-white hover:bg-slate-400"
							onClick={() => setIsNewModalOpen(true)}
						>
							Add Income
						</button>
					</div>
				</div>
				<div className="flex text-sm p-4 border-t-[1px] border-slate-200 text-gray-400">
					<div className="w-[19.5%]">
						<p>Name</p>
					</div>
					<div className="w-[20.5%]">
						<p>Amount</p>
					</div>
					<div className="w-[19.5%]">
						<p>Frequency</p>
					</div>
					<div className="w-[19.5%]">
						<p>Comments</p>
					</div>
				</div>
				<ul className="flex flex-col gap-2 h-[80vh] overflow-auto border-[1px] border-slate-200 rounded-lg">
					{incomes.map((income: Income) => (
						<IncomeItem
							key={income._id}
							income={income}
							setIsDeleteModalOpen={setIsDeleteModalOpen}
							setSelectedIncome={setSelectedIncome}
						/>
					))}
				</ul>
				{isNewModalOpen ? (
					<NewModal setIsModalOpen={setIsNewModalOpen} />
				) : null}
				{isDeleteModalOpen ? (
					<DeleteModal
						income={selectedIncome}
						setIsModalOpen={setIsDeleteModalOpen}
					/>
				) : null}
			</div>
		</div>
	);
}
