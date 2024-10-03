"use client";

import { TransactionWithBalance } from "@/lib/types";
import url from "@/lib/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format, isFuture, isPast, isToday } from "date-fns";
import { Dispatch, SetStateAction, useState } from "react";

interface ModalInterface {
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
	isModalOpen: boolean;
	setSelectedTransaction: Dispatch<SetStateAction<TransactionWithBalance>>;
	selectedTransaction: TransactionWithBalance;
}

export default function Modal({
	setIsModalOpen,
	isModalOpen,
	setSelectedTransaction,
	selectedTransaction,
}: ModalInterface) {
	const queryClient = useQueryClient();

	const [actualAmount, setActualAmount] = useState(
		String(selectedTransaction.amount)
	);

	const [actualDate, setActualDate] = useState(
		format(selectedTransaction.dueDate, "yyyy-MM-dd")
	);
	const [newName, setNewName] = useState(selectedTransaction.name);

	const editMutation = useMutation({
		mutationFn: (formData: any) =>
			fetch(`${url}:3000/api/forecast`, {
				method: "PUT",
				body: JSON.stringify(formData),
			}),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["transactions"] }),
	});

	const onClickSubmit = () => {
		if (isPast(actualDate) && !isToday(actualDate)) {
			throw new Error("Date is past, move to history instead.");
		}
		editMutation.mutate({
			transactionId: selectedTransaction._id,
			newDate: actualDate,
			newAmount: actualAmount,
			newName: newName,
		});

		setIsModalOpen(!isModalOpen);
	};

	const moveToHistoryMutation = useMutation({
		mutationFn: (formData: any) =>
			fetch(`${url}:3000/api/forecast/move`, {
				method: "PUT",
				body: JSON.stringify(formData),
			}),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["transactions"] }),
	});

	const onMoveToHistoryClick = () => {
		if (isFuture(actualDate)) {
			throw new Error("Date is in future, submit edit instead.");
		}
		const newHistory = {
			name: selectedTransaction.name,
			forecastedAmount: selectedTransaction.amount,
			actualAmount,
			forecastedDate: selectedTransaction.dueDate,
			actualDate: actualDate,
			type: selectedTransaction.type,
			typeId: selectedTransaction.typeId,
			forecastedBalance: selectedTransaction.forecastedBalance,
			actualBalance:
				selectedTransaction.forecastedBalance + Number(actualAmount),
		};

		setIsModalOpen(!isModalOpen);

		moveToHistoryMutation.mutate({
			transactionId: selectedTransaction._id,
			newHistory,
		});
	};

	return (
		<div className="z-[2] absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
			<div className="bg-black opacity-25 w-[100%] h-[100%] absolute z-[-2]"></div>
			<div className="w-[500px] bg-white z-[2] flex flex-col p-8 gap-8 rounded-2xl">
				<div>
					<h1 className="text-2xl font-bold">Edit Transaction</h1>
				</div>
				<div className="flex flex-col py-4 gap-4">
					<div className="flex gap-[30px]">
						<div>
							<p className="font-bold capitalize">{selectedTransaction.type}</p>
							<p>{selectedTransaction.name}</p>
						</div>
						<div>
							<p className="font-bold capitalize">Amount</p>
							<p>{selectedTransaction.amount}</p>
						</div>
					</div>
					<div className="flex gap-[30px]">
						<div>
							<p className="font-bold capitalize">Due Date</p>
							<p>
								{format(selectedTransaction.dueDate.toString(), "MMM d, y")}
							</p>
						</div>
						<div>
							<p className="font-bold capitalize">Forecasted Balance</p>
							<p>{selectedTransaction.forecastedBalance}</p>
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<label htmlFor="actualAmount" className="font-bold">
							Actual Amount
						</label>
						<input
							id="actualAmount"
							name="actualAmount"
							type="text"
							className="border rounded-md h-[35px] p-2"
							value={actualAmount}
							onChange={(e) => setActualAmount(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label htmlFor="actualDueDate" className="font-bold">
							Actual Date
						</label>
						<input
							id="actualDueDate"
							name="actualDueDate"
							type="date"
							className="border rounded-md h-[35px] p-2"
							value={actualDate}
							onChange={(e) => setActualDate(e.target.value)}
						/>
					</div>
					<div className="flex flex-col gap-1">
						<label htmlFor="newName" className="font-bold">
							New Name
						</label>
						<input
							id="newName"
							name="newName"
							type="text"
							className="border rounded-md h-[35px] p-2"
							value={newName}
							onChange={(e) => setNewName(e.currentTarget.value)}
						/>
					</div>
				</div>
				<div className="flex mt-auto justify-between">
					<button
						onClick={() => {
							setIsModalOpen(!isModalOpen);
							setSelectedTransaction({} as TransactionWithBalance);
						}}
						className="py-2 px-8 text-xl font-bold border-2 rounded-lg"
					>
						Close
					</button>
					<button
						className="py-2 px-8 text-sm font-bold border-2 rounded-lg"
						onClick={onMoveToHistoryClick}
					>
						Move To History
					</button>
					<button
						className="py-2 px-8 text-xl font-bold border-2 rounded-lg"
						onClick={onClickSubmit}
					>
						Submit
					</button>
				</div>
			</div>
		</div>
	);
}
