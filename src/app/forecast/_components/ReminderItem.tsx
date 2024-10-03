import Check from "@/app/_components/_common/_icons/Check";
import Close from "@/app/_components/_common/_icons/Close";
import Pencil from "@/app/_components/_common/_icons/Pencil";
import { Reminder } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface ReminderItem {
	reminder: Reminder;
}

export default function ReminderItem({ reminder }: ReminderItem) {
	const [editContent, setEditContent] = useState(reminder.content);
	const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
	const [isDeleteFieldOpen, setIsDeleteFieldOpen] = useState(false);

	const queryClient = useQueryClient();

	const editMutation = useMutation({
		mutationFn: (formData: any) =>
			fetch("http://localhost:3000/api/reminders", {
				method: "PUT",
				body: JSON.stringify(formData),
			}),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reminders"] }),
	});

	const deleteMutation = useMutation({
		mutationFn: (formData: any) =>
			fetch("http://localhost:3000/api/reminders", {
				method: "DELETE",
				body: JSON.stringify(formData),
			}),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reminders"] }),
	});

	const iconSize = 20;

	if (isEditFieldOpen) {
		return (
			<div className="flex w-[300px] justify-between items-center border-b-[1px]">
				<input
					className="p-1 border-[1px]"
					value={editContent}
					onChange={(e) => setEditContent(e.currentTarget.value)}
				/>
				<div className="flex gap-3">
					<button
						className="flex justify-center items-center"
						onClick={() => {
							editMutation.mutate({
								_id: reminder._id,
								content: editContent,
							});
							setIsEditFieldOpen(false);
						}}
					>
						<Check className={`w-[${iconSize}px] h-[${iconSize}px]`} />
					</button>
					<button
						className="flex justify-center items-center"
						onClick={() => {
							setEditContent(reminder.content);
							setIsEditFieldOpen(false);
						}}
					>
						<Close className={`w-[${iconSize}px] h-[${iconSize}px]`} />
					</button>
				</div>
			</div>
		);
	} else if (isDeleteFieldOpen) {
		return (
			<div className="flex min-w-[300px] justify-between items-center border-b-[1px]">
				<p className="p-1">{reminder.content}</p>
				<div className="flex gap-3">
					<button
						className="flex justify-center items-center"
						onClick={() => {
							deleteMutation.mutate({ _id: reminder._id });
							setIsDeleteFieldOpen(false);
						}}
					>
						<Check className={`w-[${iconSize}px] h-[${iconSize}px]`} />
					</button>
					<button
						className="flex justify-center items-center"
						onClick={() => setIsDeleteFieldOpen(false)}
					>
						<Close className={`w-[${iconSize}px] h-[${iconSize}px]`} />
					</button>
				</div>
				<p className="absolute right-[-150px]">Delete reminder?</p>
			</div>
		);
	} else if (!isDeleteFieldOpen && !isEditFieldOpen) {
		return (
			<div className="flex min-w-[300px] justify-between items-center border-b-[1px]">
				<p className="p-1">{reminder.content}</p>
				<div className="flex gap-3">
					<button
						className="flex justify-center items-center"
						onClick={() => setIsEditFieldOpen(true)}
					>
						<Pencil className={`w-[${iconSize}px] h-[${iconSize}px]`} />
					</button>
					<button
						className="flex justify-center items-center"
						onClick={() => setIsDeleteFieldOpen(true)}
					>
						<Close className={`w-[${iconSize}px] h-[${iconSize}px]`} />
					</button>
				</div>
			</div>
		);
	}
}
