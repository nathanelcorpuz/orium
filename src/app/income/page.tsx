"use client";

import { Income } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import IncomeItem from "./_components/IncomeItem";
import NewModal from "./_components/NewModal";
import DeleteModal from "./_components/DeleteModal";

export default function IncomePage() {
	const [isNewModalOpen, setIsNewModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedIncome, setSelectedIncome] = useState({} as Income);

	const { isPending, isError, data, error } = useQuery({
		queryKey: ["income"],
		queryFn: () =>
			fetch("http://localhost:3000/api/income").then((res) => res.json()),
	});

	if (isPending) return <div>loading</div>;
	if (isError) return <div>error: {error.message}</div>;

	const incomes: Income[] = data;

	let totalMonthlyIncome = 0;

	incomes.forEach((income) => {
		if (income.frequency === "monthly") {
			totalMonthlyIncome = totalMonthlyIncome + income.amount;
		}
		if (income.frequency === "bi-weekly" || income.frequency === "15-30") {
			totalMonthlyIncome = totalMonthlyIncome + income.amount * 2;
		}
		if (income.frequency === "weekly") {
			totalMonthlyIncome = totalMonthlyIncome + income.amount * 4;
		}
	});

	return (
		<div>
			<div className="flex gap-[100px] items-center">
				<div className="flex gap-2 text-xl">
					<p>Total monthly income</p>
					<p>₱{totalMonthlyIncome}</p>
				</div>
				<div>
					<button
						className="px-8 py-2 border-[1px] border-black border-opacity-[0.1] rounded-lg hover:bg-black hover:text-white"
						onClick={() => setIsNewModalOpen(true)}
					>
						Add New Income
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
					<p>Frequency</p>
				</div>
				<div className="w-[20%]">
					<p>Comments</p>
				</div>
			</div>
			<ul className="flex flex-col gap-2 h-[80vh] overflow-auto">
				{data.map((income: Income) => (
					<IncomeItem
						key={income._id}
						income={income}
						setIsDeleteModalOpen={setIsDeleteModalOpen}
						setSelectedIncome={setSelectedIncome}
					/>
				))}
			</ul>
			{isNewModalOpen ? <NewModal setIsModalOpen={setIsNewModalOpen} /> : null}
			{isDeleteModalOpen ? (
				<DeleteModal
					income={selectedIncome}
					setIsModalOpen={setIsDeleteModalOpen}
				/>
			) : null}
		</div>
	);
}
