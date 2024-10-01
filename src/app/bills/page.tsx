"use client";

import { Bill } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import NewModal from "./_components/NewModal";
import BillItem from "./_components/BillItem";
import DeleteModal from "./_components/DeleteModal";
import EditModal from "./_components/EditModal";

export default function Bills() {
	const [isNewModalOpen, setIsNewModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedBill, setSelectedBill] = useState({} as Bill);

	const { isPending, isError, data, error } = useQuery({
		queryKey: ["bills"],
		queryFn: () =>
			fetch("http://localhost:3000/api/bills").then((res) => res.json()),
	});

	if (isPending) return <div>loading</div>;
	if (isError) return <div>error: {error.message}</div>;

	return (
		<div>
			<div className="flex gap-[100px] items-center">
				<div className="flex gap-2 text-xl">
					<p>Total monthly bills</p>
					<p>₱23,000</p>
				</div>
				<div>
					<button
						className="px-8 py-2 border-[1px] border-black border-opacity-[0.1] rounded-lg hover:bg-black hover:text-white"
						onClick={() => setIsNewModalOpen(true)}
					>
						Add New Bill
					</button>
				</div>
			</div>
			<div className="flex font-bold py-2 px-4">
				<div className="w-[20%]">
					<p>Name</p>
				</div>
				<div className="w-[20%]">
					<p>Amount</p>
				</div>
				<div className="w-[20%]">
					<p>Due Date</p>
				</div>
				<div className="w-[20%]">
					<p>Comments</p>
				</div>
			</div>
			<ul className="flex flex-col h-[80vh] overflow-auto">
				{data.map((bill: Bill) => (
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

			{isNewModalOpen ? <NewModal setIsModalOpen={setIsNewModalOpen} /> : null}
		</div>
	);
}
