"use client";

import { Balance } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import NewModal from "./_components/NewModal";
import BalanceItem from "./_components/BalanceItem";
import DeleteModal from "./_components/DeleteModal";
import EditModal from "./_components/EditModal";
import url from "@/lib/url";

export default function Balances() {
	const [isNewModalOpen, setIsNewModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedBalance, setSelectedBalance] = useState({} as Balance);

	const { isPending, isError, data, error } = useQuery({
		queryKey: ["balances"],
		queryFn: () => fetch(`${url}/api/balances`).then((res) => res.json()),
	});

	if (isPending) return <div>loading</div>;
	if (isError) return <div>error: {error.message}</div>;

	const balances: Balance[] = data;

	let totalBalance = 0;

	balances.forEach((balance) => {
		totalBalance = totalBalance + balance.amount;
	});

	return (
		<div>
			<div className="flex gap-[100px] items-center">
				<div className="flex gap-2 text-xl">
					<p>Total balance</p>
					<p>₱{totalBalance}</p>
				</div>
				<div>
					<button
						className="px-8 py-2 border-[1px] border-black border-opacity-[0.1] rounded-lg hover:bg-black hover:text-white"
						onClick={() => setIsNewModalOpen(true)}
					>
						Add New Balance
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
					<p>Comments</p>
				</div>
			</div>
			<ul className="flex flex-col gap-2 h-[80vh] overflow-auto">
				{data.map((balance: Balance) => (
					<BalanceItem
						key={balance._id}
						balance={balance}
						setIsDeleteModalOpen={setIsDeleteModalOpen}
						setIsEditModalOpen={setIsEditModalOpen}
						setSelectedBalance={setSelectedBalance}
					/>
				))}
			</ul>

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
