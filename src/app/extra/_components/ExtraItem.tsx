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
		<div className="flex py-2 px-4 bg-black bg-opacity-[0.05] relative rounded-full">
			<div className="w-[20%]">
				<p>{extra.name}</p>
			</div>
			<div className="w-[20%]">
				<p>{extra.amount}</p>
			</div>
			<div className="w-[20%]">
				<p>{format(extra.date, "MMM d, yyyy")}</p>
			</div>
			<div className="w-[20%]">
				<p>{extra.comments}</p>
			</div>
			<div className="absolute right-[20%] flex justify-center items-center top-0 bottom-0">
				<div className="flex">
					<button
						className="p1 px-4 hover:underline"
						onClick={() => {
							setIsEditModalOpen(true);
							setSelectedExtra(extra);
						}}
					>
						Edit
					</button>
					<button
						className="p-1 px-4 hover:underline"
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
