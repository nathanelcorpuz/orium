"use client";

import { Reminder } from "@/lib/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import ReminderItem from "./ReminderItem";
import url from "@/lib/url";

export default function Reminders() {
	const queryClient = useQueryClient();

	const { isPending, data, isError } = useQuery({
		queryKey: ["reminders"],
		queryFn: () =>
			fetch(`${url}/api/reminders`).then((res) => {
				if (!res.ok) throw new Error(res.statusText);
				return res.json();
			}),
	});

	interface FormData {
		content: string;
	}

	const newMutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/reminders`, {
				method: "POST",
				body: JSON.stringify(formData),
			}).then((res) => {
				if (!res.ok) throw new Error(res.statusText);
				return res;
			}),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reminders"] }),
	});

	const [isNewFieldOpen, setIsNewFieldOpen] = useState(false);

	const [newContent, setNewContent] = useState("");

	if (isPending) return <p>Loading reminders...</p>;
	if (isError) return <p>Something went wrong with reminders...</p>;

	const reminders: Reminder[] = data;

	return (
		<div className="relative p-6 gap-8 flex flex-col items-start bg-white w-[500px] h-[90vh] rounded-lg">
			<div className="flex gap-8">
				<p className="text-gray-400 text-sm">Reminders</p>
			</div>
			<ul className="p-2 rounded-md flex flex-col gap-2 h-full overflow-auto w-full border">
				{reminders.map((reminder) => (
					<ReminderItem key={reminder._id} reminder={reminder} />
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
				<div className="w-[300px]">
					<p className="pb-2 font-bold">New reminder</p>
					<input
						value={newContent}
						onChange={(e) => setNewContent(e.currentTarget.value)}
						className="border-[1px] p-1 w-full"
					/>
					<div className="flex space-between w-full">
						<button
							className="px-6 py-1 border-[1px] w-full"
							onClick={() => setIsNewFieldOpen(false)}
						>
							Close
						</button>
						<button
							className="px-6 py-1 border-[1px] w-full"
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
