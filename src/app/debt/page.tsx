"use client";

import { Debt } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import DebtItem from "./_components/DebtItem";
import DeleteModal from "./_components/DeleteModal";
import NewModal from "./_components/NewModal";
import url from "@/lib/url";

export default function Debts() {
	const [isNewModalOpen, setIsNewModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedDebt, setSelectedDebt] = useState({} as Debt);

	const { isPending, isError, data, error } = useQuery({
		queryKey: ["debts"],
		queryFn: () => fetch(`${url}/api/debts`).then((res) => res.json()),
	});

	if (isPending) return <div>loading</div>;
	if (isError) return <div>error: {error.message}</div>;

	return (
		<div>
			<div className="flex gap-[100px] items-center">
				<div>
					<button
						className="px-8 py-2 border-[1px] border-black border-opacity-[0.1] rounded-lg hover:bg-black hover:text-white"
						onClick={() => setIsNewModalOpen(true)}
					>
						Add New Debt
					</button>
				</div>
			</div>
			<div className="flex font-bold py-2 px-4">
				<div className="w-[16.65%]">
					<p>Name</p>
				</div>
				<div className="w-[16.65%]">
					<p>Amount</p>
				</div>
				<div className="w-[16.65%]">
					<p>Due Date</p>
				</div>
				<div className="w-[16.65%]">
					<p>Start Date</p>
				</div>
				<div className="w-[16.65%]">
					<p>End Date</p>
				</div>
				<div className="w-[16.65%]">
					<p>Comments</p>
				</div>
			</div>
			<ul className="flex flex-col gap-2 h-[80vh] overflow-auto">
				{data.map((debt: Debt) => (
					<DebtItem
						key={debt._id}
						debt={debt}
						setIsDeleteModalOpen={setIsDeleteModalOpen}
						setSelectedDebt={setSelectedDebt}
					/>
				))}
			</ul>

			{isDeleteModalOpen ? (
				<DeleteModal
					setIsModalOpen={setIsDeleteModalOpen}
					debt={selectedDebt}
				/>
			) : null}

			{isNewModalOpen ? <NewModal setIsModalOpen={setIsNewModalOpen} /> : null}
		</div>
	);
}
