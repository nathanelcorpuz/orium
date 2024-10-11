import { Extra } from "@/lib/types";
import { format } from "date-fns";
import { Dispatch, SetStateAction } from "react";

interface ExtraItem {
	extra: Extra;
	setIsEditModalOpen: Dispatch<SetStateAction<boolean>>;
	setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
	setSelectedExtra: Dispatch<SetStateAction<Extra>>;
}

export default function ExtraItem({
	extra,
	setIsEditModalOpen,
	setIsDeleteModalOpen,
	setSelectedExtra,
}: ExtraItem) {
	return (
		<div className="flex py-1 px-4 border-b-[1px] border-slate-200 text-sm">
			<div className="w-[20%] flex items-center">
				<p>{extra.name}</p>
			</div>
			<div className="w-[20%] flex items-center">
				<p>{extra.amount}</p>
			</div>
			<div className="w-[20%] flex items-center">
				<p>{format(extra.date, "MMM d, yyyy")}</p>
			</div>
			<div className="w-[20%] flex items-center">
				<p>{extra.comments}</p>
			</div>
			<div className="ml-auto">
				<div className="flex">
					<button
						className="p-1 px-4 hover:underline text-sm text-slate-400"
						onClick={() => {
							setIsEditModalOpen(true);
							setSelectedExtra(extra);
						}}
					>
						Edit
					</button>
					<button
						className="p-1 px-4 hover:underline text-sm text-slate-400"
						onClick={() => {
							setIsDeleteModalOpen(true);
							setSelectedExtra(extra);
						}}
					>
						Delete
					</button>
				</div>
			</div>
		</div>
	);
}
