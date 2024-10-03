"use client";

import { Savings } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import SavingsItem from "./_components/SavingsItem";
import DeleteModal from "./_components/DeleteModal";
import NewModal from "./_components/NewModal";
import url from "@/lib/url";

export default function Savingss() {
	const [isNewModalOpen, setIsNewModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedSavings, setSelectedSavings] = useState({} as Savings);

	const { isPending, isError, data, error } = useQuery({
		queryKey: ["savings"],
		queryFn: () => fetch(`${url}/api/savings`).then((res) => res.json()),
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
						Add New Savings
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
				{data.map((savings: Savings) => (
					<SavingsItem
						key={savings._id}
						savings={savings}
						setIsDeleteModalOpen={setIsDeleteModalOpen}
						setSelectedSavings={setSelectedSavings}
					/>
				))}
			</ul>

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
