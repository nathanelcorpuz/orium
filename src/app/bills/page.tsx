"use client";

import { Bill } from "@/lib/types";
import { useState } from "react";
import NewModal from "./_components/NewModal";
import BillItem from "./_components/BillItem";
import DeleteModal from "./_components/DeleteModal";
import EditModal from "./_components/EditModal";
import useBillsQuery from "../_hooks/useBillsQuery";
import usePreferencesQuery from "../_hooks/usePreferencesQuery";

export default function Bills() {
	const [isNewModalOpen, setIsNewModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedBill, setSelectedBill] = useState({} as Bill);

	const { bills, totalBills, billsPending } = useBillsQuery();

	const { preferences, isPreferencesPending } = usePreferencesQuery();

	return billsPending || isPreferencesPending ? (
		<div className="w-full h-full flex justify-center items-center">
			<p className="text-lg text-slate-400">Loading bills...</p>
		</div>
	) : (
		<div className="flex flex-col p-8 z-[-5]">
			<div className="bg-white flex flex-col w-[1000px] p-5 rounded-lg h-[90vh]">
				<div className="flex gap-[100px] items-center justify-between">
					<div className="flex flex-col py-2">
						<p className="text-sm text-gray-400">Total Monthly Bills</p>
						<p className="text-2xl">
							{preferences.currency}
							{totalBills.toLocaleString()}
						</p>
					</div>
					<div>
						<button
							className="h-[45px] w-[150px] border-[1px] rounded-md transition-all bg-slate-500 text-white hover:bg-slate-400"
							onClick={() => setIsNewModalOpen(true)}
						>
							Add Bill
						</button>
					</div>
				</div>
				<div className="flex text-sm p-4 border-t-[1px] border-slate-200 text-gray-400">
					<div className="w-[19.5%]">
						<p>Name</p>
					</div>
					<div className="w-[19.5%]">
						<p>Amount</p>
					</div>
					<div className="w-[19.5%]">
						<p>Due Date</p>
					</div>
					<div className="w-[19.5%]">
						<p>Comments</p>
					</div>
				</div>
				<ul className="flex flex-col gap-2 h-[80vh] overflow-auto border-[1px] border-slate-200 rounded-lg">
					{bills.map((bill: Bill) => (
						<BillItem
							key={bill._id}
							bill={bill}
							setIsDeleteModalOpen={setIsDeleteModalOpen}
							setIsEditModalOpen={setIsEditModalOpen}
							setSelectedBill={setSelectedBill}
						/>
					))}
				</ul>

				{isDeleteModalOpen ? (
					<DeleteModal
						setIsModalOpen={setIsDeleteModalOpen}
						bill={selectedBill}
					/>
				) : null}

				{isEditModalOpen ? (
					<EditModal setIsModalOpen={setIsEditModalOpen} bill={selectedBill} />
				) : null}

				{isNewModalOpen ? (
					<NewModal setIsModalOpen={setIsNewModalOpen} />
				) : null}
			</div>
		</div>
	);
}
