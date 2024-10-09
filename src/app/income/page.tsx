"use client";

import { Income } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import IncomeItem from "./_components/IncomeItem";
import NewModal from "./_components/NewModal";
import DeleteModal from "./_components/DeleteModal";
import url from "@/lib/url";

export default function IncomePage() {
	const [isNewModalOpen, setIsNewModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [selectedIncome, setSelectedIncome] = useState({} as Income);

	const { isPending, isError, data, error } = useQuery({
		queryKey: ["income"],
		queryFn: () =>
			fetch(`${url}/api/income`).then((res) => {
				if (!res.ok) throw new Error(res.statusText);
				return res.json();
			}),
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
					{data.map((income: Income) => (
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
