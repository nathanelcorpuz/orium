"use client";

import url from "@/lib/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import checkRanges from "./_utils/rangeChecker";
import { APIResult } from "@/lib/types";
import loader from "@/lib/loader";

interface RangeModal {
	setModalOpen: Dispatch<SetStateAction<boolean>>;
	ranges: number[];
}

export default function RangeModal({ setModalOpen, ranges }: RangeModal) {
	const [danger, setDanger] = useState(String(ranges[0]));
	const [dangerError, setDangerError] = useState("");
	const [low, setLow] = useState(String(ranges[1]));
	const [lowError, setLowError] = useState("");
	const [medium, setMedium] = useState(String(ranges[2]));
	const [mediumError, setMediumError] = useState("");
	const [high, setHigh] = useState(String(ranges[3]));
	const [highError, setHighError] = useState("");
	const [higher, setHigher] = useState(String(ranges[4]));
	const [higherError, setHigherError] = useState("");
	const [blankError, setBlankError] = useState(false);

	const queryClient = useQueryClient();

	interface FormData {
		balanceRanges: number[];
	}

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/preferences`, {
				method: "PUT",
				body: JSON.stringify(formData),
			}).then(async (res) => {
				
				return res.json();
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["preferences"] });
		},
	});

	const onSubmit = async () => {
		if (
			danger === "" ||
			low === "" ||
			medium === "" ||
			high === "" ||
			higher === ""
		) {
			setBlankError(true);
			return;
		} else setBlankError(false);

		const rangeCheckResult = checkRanges(
			{
				danger: Number(danger),
				low: Number(low),
				medium: Number(medium),
				high: Number(high),
				higher: Number(higher),
			},
			{
				setDangerError,
				setLowError,
				setMediumError,
				setHighError,
				setHigherError,
			}
		);

		if (!rangeCheckResult.success) {
			return;
		}

		const result: APIResult = await mutation.mutateAsync({
			balanceRanges: [
				Number(danger),
				Number(low),
				Number(medium),
				Number(high),
				Number(higher),
			],
		});

		if (result.success) {
			setModalOpen(false);
		}
	};

	return (
		<div className="z-[2] absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
			<div className="bg-black opacity-25 w-[100%] h-[100%] absolute"></div>
			<div className="w-[500px] bg-white z-[2] flex flex-col p-8 gap-8 rounded-2xl">
				<h1 className="text-2xl">Set Balance Ranges</h1>
				<div className="border-b-[1px] border-slate-200"></div>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-1">
							<div className="w-[70px] h-[20px] bg-slate-800 flex items-center justify-center rounded-md">
								<p className="text-white text-xs">Danger</p>
							</div>
							<input
								className="border rounded-md h-[35px] p-2 w-full"
								value={danger}
								type="number"
								onChange={(e) => setDanger(e.currentTarget.value)}
							/>
							<p className="text-xs text-slate-400">
								Transaction balances less than or equal to this amount
							</p>
							{dangerError && (
								<p className="text-red-500 text-xs">{dangerError}</p>
							)}
						</div>
						<div className="flex flex-col gap-1">
							<div className="w-[70px] h-[20px] bg-red-200 flex items-center justify-center rounded-md">
								<p className="text-xs">Low</p>
							</div>

							<input
								className="border rounded-md h-[35px] p-2 w-full"
								value={low}
								type="number"
								onChange={(e) => setLow(e.currentTarget.value)}
							/>
							<p className="text-xs text-slate-400">
								Transaction balances up to this amount
							</p>
							{lowError && <p className="text-red-500 text-xs">{lowError}</p>}
						</div>
						<div className="flex flex-col gap-1">
							<div className="w-[70px] h-[20px] bg-white border-[1px] border-slate-200 flex items-center justify-center rounded-md">
								<p className="text-xs">Medium</p>
							</div>
							<input
								className="border rounded-md h-[35px] p-2 w-full"
								value={medium}
								type="number"
								onChange={(e) => setMedium(e.currentTarget.value)}
							/>
							<p className="text-xs text-slate-400">
								Transaction balances up to this amount
							</p>
							{mediumError && (
								<p className="text-red-500 text-xs">{mediumError}</p>
							)}
						</div>
						<div className="flex flex-col gap-1">
							<div className="w-[70px] h-[20px] bg-green-100 flex items-center justify-center rounded-md">
								<p className="text-xs">High</p>
							</div>
							<input
								className="border rounded-md h-[35px] p-2 w-full"
								value={high}
								type="number"
								onChange={(e) => setHigh(e.currentTarget.value)}
							/>
							<p className="text-xs text-slate-400">
								Transaction balances up to this amount
							</p>
							{highError && <p className="text-red-500 text-xs">{highError}</p>}
						</div>
						<div className="flex flex-col gap-1">
							<div className="w-[70px] h-[20px] bg-green-200 flex items-center justify-center rounded-md">
								<p className="text-xs">Higher</p>
							</div>
							<input
								className="border rounded-md h-[35px] p-2 w-full"
								value={higher}
								type="number"
								onChange={(e) => setHigher(e.currentTarget.value)}
							/>
							<p className="text-xs text-slate-400">
								Transaction balances up to this amount
							</p>
							{higherError && (
								<p className="text-red-500 text-xs">{higherError}</p>
							)}
						</div>
						<div className="flex flex-col gap-1">
							<div className="w-[70px] h-[20px] bg-green-300 flex items-center justify-center rounded-md">
								<p className="text-xs">Highest</p>
							</div>
							<p className="text-xs text-slate-400">
								Transaction balances greater than the Higher amount
							</p>
						</div>
					</div>
					{blankError && (
						<p className="text-red-500 text-xs">
							One of the fields above is blank.
						</p>
					)}
					<div className="flex mt-auto justify-between">
						<button
							disabled={mutation.isPending}
							className={`h-[45px] w-[150px] border-[1px] rounded-md transition-all bg-slate-500 text-white hover:bg-slate-400 ${
								mutation.isPending ? "opacity-[0.5]" : "opacity-100"
							}`}
							onClick={() => setModalOpen(false)}
						>
							Close
						</button>
						<button
							disabled={mutation.isPending}
							className={`h-[45px] w-[150px] border-[1px] rounded-md transition-all bg-slate-500 text-white hover:bg-slate-400 ${
								mutation.isPending ? "opacity-[0.5]" : "opacity-100"
							}`}
							onClick={onSubmit}
						>
							Submit
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
