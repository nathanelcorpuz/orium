import { Extra } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Dispatch, SetStateAction, useState } from "react";

interface EditModal {
	extra: Extra;
	setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EditModal({ extra, setIsModalOpen }: EditModal) {
	const [name, setName] = useState(extra.name);
	const [amount, setAmount] = useState(String(extra.amount));
	const [date, setDate] = useState(format(extra.date, "yyyy-MM-dd"));
	const [comments, setComments] = useState(extra.comments);

	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: (formData: any) =>
			fetch("http://localhost:3000/api/extras", {
				method: "PUT",
				body: JSON.stringify(formData),
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["extras"] });
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});

	const onClickClose = () => {
		setIsModalOpen(false);
	};

	const onClickSubmit = () => {
		mutation.mutate({
			_id: extra._id,
			name,
			amount: Number(amount),
			date,
			comments: comments || "",
		});
		setIsModalOpen(false);
	};

	return (
		<div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
			<div className="bg-black opacity-25 w-[100%] h-[100%] absolute z-[-2]"></div>
			<div className="w-[500px] bg-white z-[2] flex flex-col p-8 gap-8 rounded-2xl">
				<div className="flex flex-col py-4 gap-4">
					<form
						className="flex flex-col gap-6"
						onSubmit={async (e) => {
							e.preventDefault();
						}}
					>
						<h1 className="text-2xl font-bold">Edit Extra?</h1>
						<p>
							This will edit all related transactions, even the independently
							edited ones.
						</p>
						<div className="flex flex-col">
							<label htmlFor="name">Name</label>
							<input
								name="name"
								className="border-[1px] h-[35px] p-2 rounded-md"
								value={name}
								onChange={(e) => setName(e.currentTarget.value)}
							/>
						</div>
						<div className="flex flex-col">
							<label htmlFor="amount">Amount</label>
							<input
								name="amount"
								className="border-[1px] h-[35px] p-2 rounded-md"
								type="text"
								value={amount}
								onChange={(e) => setAmount(e.currentTarget.value)}
							/>
						</div>
						<div className="flex flex-col">
							<label htmlFor="date">Date</label>
							<input
								name="date"
								className="border-[1px] h-[35px] p-2 rounded-md"
								type="date"
								value={date}
								onChange={(e) => setDate(e.currentTarget.value)}
							/>
						</div>
						<div className="flex flex-col">
							<label htmlFor="comments">Comments</label>
							<input
								name="comments"
								className="border-[1px] h-[35px] p-2 rounded-md"
								type="text"
								value={comments}
								onChange={(e) => setComments(e.currentTarget.value)}
							/>
						</div>
						<div className="flex mt-auto justify-between">
							<button
								className="py-2 px-8 text-xl font-bold border-2 rounded-lg"
								onClick={onClickClose}
							>
								Close
							</button>
							<button
								className="py-2 px-8 text-xl font-bold border-2 rounded-lg"
								onClick={onClickSubmit}
							>
								Submit
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
