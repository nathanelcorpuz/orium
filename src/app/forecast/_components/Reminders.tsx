"use client";

import Check from "@/app/_components/_common/_icons/Check";
import Close from "@/app/_components/_common/_icons/Close";
import Pencil from "@/app/_components/_common/_icons/Pencil";
import { Reminder } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import ReminderItem from "./ReminderItem";

export default function Reminders() {
	const queryClient = useQueryClient();

	const { isPending, data, isError } = useQuery({
		queryKey: ["reminders"],
		queryFn: () =>
			fetch("http://localhost:3000/api/reminders").then((res) => res.json()),
	});

	const newMutation = useMutation({
		mutationFn: (formData: any) =>
			fetch("http://localhost:3000/api/reminders", {
				method: "POST",
				body: JSON.stringify(formData),
			}),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reminders"] }),
	});

	const [isNewFieldOpen, setIsNewFieldOpen] = useState(false);

	const [newContent, setNewContent] = useState("");

	if (isPending) return <p>Loading reminders...</p>;
	if (isError) return <p>Something went wrong with reminders...</p>;

	const reminders: Reminder[] = data;

	return (
		<div className="relative p-2 gap-2 flex flex-col items-start">
			<div className="flex gap-8">
				<p className="text-xl">Reminders</p>
			</div>
			<ul className="bg-slate-100 p-2 rounded-md flex flex-col gap-2">
				{reminders.map((reminder) => (
					<ReminderItem reminder={reminder} />
				))}
			</ul>
			{!isNewFieldOpen && (
				<button
					className="text-sm underline"
					onClick={() => setIsNewFieldOpen(true)}
				>
					Add New
				</button>
			)}
			{isNewFieldOpen && (
				<div className="">
					<input
						value={newContent}
						onChange={(e) => setNewContent(e.currentTarget.value)}
						className="border-[1px] p-1"
					/>
					<div className="flex space-between">
						<button
							className="px-6 py-1 border-[1px]"
							onClick={() => setIsNewFieldOpen(false)}
						>
							Close
						</button>
						<button
							className="px-6 py-1 border-[1px]"
							onClick={() => {
								newMutation.mutate({ content: newContent });
								setIsNewFieldOpen(false);
								setNewContent("");
							}}
						>
							Submit
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
