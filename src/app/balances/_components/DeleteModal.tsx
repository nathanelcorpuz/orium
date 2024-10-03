import { Balance } from "@/lib/types";
import url from "@/lib/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";

interface DeleteModal {
	balance: Balance;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DeleteModal({ balance, setIsModalOpen }: DeleteModal) {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (formData: any) =>
			fetch(`${url}/api/balances`, {
				method: "DELETE",
				body: JSON.stringify(formData),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["balances"] });
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});

	const onClickClose = () => {
		setIsModalOpen(false);
	};
	const onClickSubmit = () => {
		mutation.mutate({ _id: balance._id });
		setIsModalOpen(false);
	};
	return (
		<div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
			<div className="bg-black opacity-25 w-[100%] h-[100%] absolute z-[-2]"></div>
			<div className="w-[500px] bg-white z-[2] flex flex-col p-8 gap-8 rounded-2xl">
				<div className="flex flex-col py-4 gap-4">
					<div className="flex flex-col gap-6">
						<h1 className="text-2xl font-bold">Delete Balance</h1>
						<div className="flex flex-col">
							<p className="font-bold">Name</p>
							<p>{balance.name}</p>
						</div>
						<div className="flex flex-col">
							<p className="font-bold">Amount</p>
							<p>{balance.amount}</p>
						</div>
						<div className="flex flex-col">
							<p className="font-bold">Comments</p>
							<p>{balance.comments}</p>
						</div>
						<div className="flex mt-auto justify-between">
							<button
								className="py-2 px-8 text-xl font-bold border-2 rounded-lg hover:bg-black hover:text-white"
								onClick={onClickClose}
							>
								Close
							</button>
							<button
								className="py-2 px-8 text-xl font-bold border-2 rounded-lg hover:bg-black hover:text-white"
								onClick={onClickSubmit}
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
