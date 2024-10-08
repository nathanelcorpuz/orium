import { Bill } from "@/lib/types";
import url from "@/lib/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";

interface DeleteModal {
	bill: Bill;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DeleteModal({ bill, setIsModalOpen }: DeleteModal) {
	const queryClient = useQueryClient();

	interface FormData {
		_id: string;
	}

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/bills`, {
				method: "DELETE",
				body: JSON.stringify(formData),
			}).then((res) => {
				if (!res.ok) throw new Error(res.statusText);
				return res;
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["bills"] });
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});

	const onClickClose = () => {
		setIsModalOpen(false);
	};
	const onClickSubmit = async () => {
		const res = await mutation.mutateAsync({ _id: bill._id });
		if (res.ok) setIsModalOpen(false);
	};
	return (
		<div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
			<div className="bg-black opacity-25 w-[100%] h-[100%] absolute"></div>
			<div className="w-[500px] bg-white flex flex-col p-8 gap-8 rounded-2xl z-[99]">
				<div className="flex flex-col py-4 gap-4">
					<div className="flex flex-col gap-6">
						<h1 className="text-2xl font-bold">Delete Bill</h1>
						<p>This will delete all related transactions.</p>
						<div className="border-b-[1px] border-slate-200"></div>
						<div className="flex flex-col">
							<p className="text-sm text-slate-400">Name</p>
							<p>{bill.name}</p>
						</div>
						<div className="flex flex-col">
							<p className="text-sm text-slate-400">Amount</p>
							<p>{bill.amount}</p>
						</div>
						<div className="flex flex-col">
							<p className="text-sm text-slate-400">Monthly Due Date</p>
							<p>{bill.day}</p>
						</div>
						<div className="flex flex-col">
							<p className="text-sm text-slate-400">Comments</p>
							<p>{bill.comments}</p>
						</div>
						<div className="flex mt-auto justify-between">
							<button
								className="h-[45px] w-[150px] border-[1px] rounded-md transition-all bg-slate-500 text-white hover:bg-slate-400"
								onClick={onClickClose}
							>
								Close
							</button>
							<button
								className="h-[45px] w-[150px] border-[1px] rounded-md transition-all bg-slate-500 text-white hover:bg-slate-400"
								onClick={onClickSubmit}
							>
								Submit
							</button>
						</div>
						{mutation.isError && (
							<p className="text-red-600">{mutation.error.message}</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
