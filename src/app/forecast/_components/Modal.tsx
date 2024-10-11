"use client";

import { APIResult, TransactionWithBalance } from "@/lib/types";
import url from "@/lib/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
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

	const [editError, setEditError] = useState("");
	const [moveError, setMoveError] = useState("");

	interface FormData {
		transactionId: string;
		newDate: string;
		newAmount: string;
		newName: string;
	}

	const editMutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/forecast`, {
				method: "PUT",
				body: JSON.stringify(formData),
			}).then((res) => {
				return res.json();
			}),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["transactions"] }),
	});

	const onClickSubmit = async () => {
		const result: APIResult = await editMutation.mutateAsync({
			transactionId: selectedTransaction._id,
			newDate: actualDate,
			newAmount: actualAmount,
			newName: newName,
		});

		if (!result.success) setEditError(result.message);
		if (result.success) setIsModalOpen(false);
	};

	interface MoveFormData {
		transactionId: string;
		newHistory: {
			name: string;
			forecastedAmount: number;
			actualAmount: string;
			forecastedDate: Date;
			actualDate: string;
			type: string;
			typeId: string;
			forecastedBalance: number;
			actualBalance: number;
		};
	}

	const moveToHistoryMutation = useMutation({
		mutationFn: (formData: MoveFormData) =>
			fetch(`${url}/api/forecast/move`, {
				method: "PUT",
				body: JSON.stringify(formData),
			}).then((res) => {
				return res.json();
			}),
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: ["transactions"] }),
	});

	const onMoveToHistoryClick = async () => {
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

		const result: APIResult = await moveToHistoryMutation.mutateAsync({
			transactionId: selectedTransaction._id,
			newHistory,
		});

		if (!result.success) setMoveError(result.message);
		if (result.success) setIsModalOpen(false);
	};

	return (
		<div className="z-[2] absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
			<div className="bg-black opacity-25 w-[100%] h-[100%] absolute"></div>
			<div className="w-[500px] bg-white z-[2] flex flex-col p-8 gap-8 rounded-2xl">
				<h1 className="text-2xl">Edit Transaction</h1>
				<div className="border-b-[1px] border-slate-200"></div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-4">
						<div className="flex gap-4">
							<div className="w-full border-[1px] rounded-md p-3">
								<p className="text-sm text-slate-400 capitalize">
									{selectedTransaction.type}
								</p>
								<p>{selectedTransaction.name}</p>
							</div>
							<div className="w-full border-[1px] rounded-md p-3">
								<p className="text-sm text-slate-400 capitalize">Amount</p>
								<p>{selectedTransaction.amount}</p>
							</div>
						</div>
						<div className="flex gap-4">
							<div className="w-full border-[1px] rounded-md p-3">
								<p className="text-sm text-slate-400 capitalize">Due Date</p>
								<p>
									{format(selectedTransaction.dueDate.toString(), "MMM d, y")}
								</p>
							</div>
							<div className="w-full border-[1px] rounded-md p-3">
								<p className="text-sm text-slate-400 capitalize">
									Forecasted Balance
								</p>
								<p>{selectedTransaction.forecastedBalance}</p>
							</div>
						</div>
					</div>
					<div className="flex flex-col gap-1">
						<label htmlFor="actualAmount" className="text-sm text-slate-400">
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
						<label htmlFor="actualDueDate" className="text-sm text-slate-400">
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
						<label htmlFor="newName" className="text-sm text-slate-400">
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
						disabled={moveToHistoryMutation.isPending || editMutation.isPending}
						className={`
          py-3 bg-[#202020] text-white rounded-lg
          w-[100%] hover:bg-[#505050] transition-all
					${
						moveToHistoryMutation.isPending || editMutation.isPending
							? "opacity-[0.5]"
							: "opacity-100"
					}
					`}
					>
						Close
					</button>
					<button
						disabled={moveToHistoryMutation.isPending || editMutation.isPending}
						className={`
          py-3 bg-[#202020] text-white rounded-lg
          w-[100%] hover:bg-[#505050] transition-all
					${
						moveToHistoryMutation.isPending || editMutation.isPending
							? "opacity-[0.5]"
							: "opacity-100"
					}
					`}
						onClick={onMoveToHistoryClick}
					>
						Move To History
					</button>
					<button
						disabled={moveToHistoryMutation.isPending || editMutation.isPending}
						className={`
          py-3 bg-[#202020] text-white rounded-lg
          w-[100%] hover:bg-[#505050] transition-all
					${
						moveToHistoryMutation.isPending || editMutation.isPending
							? "opacity-[0.5]"
							: "opacity-100"
					}
					`}
						onClick={onClickSubmit}
					>
						Submit
					</button>
				</div>
				{moveError && <p className="text-red-500">{moveError}</p>}
				{editError && <p className="text-red-500">{editError}</p>}
			</div>
		</div>
	);
}
