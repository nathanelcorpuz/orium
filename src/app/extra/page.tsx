"use client";

import { Extra } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import NewModal from "./_components/NewModal";
import ExtraItem from "./_components/ExtraItem";
import DeleteModal from "./_components/DeleteModal";
import EditModal from "./_components/EditModal";

export default function Extras() {
	const [isNewModalOpen, setIsNewModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedExtra, setSelectedExtra] = useState({} as Extra);

	const { isPending, isError, data, error } = useQuery({
		queryKey: ["extras"],
		queryFn: () =>
			fetch("http://localhost:3000/api/extras").then((res) => res.json()),
	});

	if (isPending) return <div>loading</div>;
	if (isError) return <div>error: {error.message}</div>;

	return (
		<div>
			<div className="flex gap-[100px] items-center">
				<div>
					<button
						className="px-8 py-2 border-[1px] border-black border-opacity-[0.1] rounded-lg hover:bg-black hover:text-white"
						onClick={() => setIsNewModalOpen(true)}
					>
						Add New Extra
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
					<p>Due Date</p>
				</div>
				<div className="w-[20%]">
					<p>Comments</p>
				</div>
			</div>
			<ul className="flex flex-col gap-2 h-[80vh] overflow-auto">
				{data.map((extra: Extra) => (
					<ExtraItem
						key={extra._id}
						extra={extra}
						setIsDeleteModalOpen={setIsDeleteModalOpen}
						setIsEditModalOpen={setIsEditModalOpen}
						setSelectedExtra={setSelectedExtra}
					/>
				))}
			</ul>

			{isDeleteModalOpen ? (
				<DeleteModal
					setIsModalOpen={setIsDeleteModalOpen}
					extra={selectedExtra}
				/>
			) : null}

			{isEditModalOpen ? (
				<EditModal setIsModalOpen={setIsEditModalOpen} extra={selectedExtra} />
			) : null}

			{isNewModalOpen ? <NewModal setIsModalOpen={setIsNewModalOpen} /> : null}
		</div>
	);
}
