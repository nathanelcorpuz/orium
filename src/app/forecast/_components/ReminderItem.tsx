"use client";

import Check from "@/app/_components/_icons/Check";
import Close from "@/app/_components/_icons/Close";
import Pencil from "@/app/_components/_icons/Pencil";
import { APIResult, Reminder } from "@/lib/types";
import url from "@/lib/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface ReminderItem {
	reminder: Reminder;
}

export default function ReminderItem({ reminder }: ReminderItem) {
	const [editContent, setEditContent] = useState(reminder.content);
	const [isEditFieldOpen, setIsEditFieldOpen] = useState(false);
	const [isDeleteFieldOpen, setIsDeleteFieldOpen] = useState(false);

	const [editError, setEditError] = useState("");
	const [deleteError, setDeleteError] = useState("");

	const queryClient = useQueryClient();

	interface EditFormData {
		_id: string;
		content: string;
	}

	const editMutation = useMutation({
		mutationFn: (formData: EditFormData) =>
			fetch(`${url}/api/reminders`, {
				method: "PUT",
				body: JSON.stringify(formData),
			}).then((res) => {
				return res.json();
			}),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reminders"] }),
	});

	interface DeleteFormData {
		_id: string;
	}

	const deleteMutation = useMutation({
		mutationFn: (formData: DeleteFormData) =>
			fetch(`${url}/api/reminders`, {
				method: "DELETE",
				body: JSON.stringify(formData),
			}).then((res) => {
				return res.json();
			}),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reminders"] }),
	});

	if (isEditFieldOpen) {
		return (
			<div className="flex w-full justify-between items-center gap-2">
				<input
					className="p-2 border-[1px] w-[85%] text-sm rounded-md"
					value={editContent}
					onChange={(e) => setEditContent(e.currentTarget.value)}
				/>
				<div className="flex-col">
					<div className="flex gap-1">
						<button
							className="flex justify-center items-center"
							onClick={async () => {
								const res: APIResult = await editMutation.mutateAsync({
									_id: reminder._id,
									content: editContent,
								});
								if (!res.success) setEditError(res.message);
								if (res.success) setIsEditFieldOpen(false);
							}}
						>
							<Check
								className={`w-[25px] h-[25px] transition-all hover:bg-slate-200 p-[5px] rounded-full`}
							/>
						</button>
						<button
							className="flex justify-center items-center"
							onClick={() => {
								setEditContent(reminder.content);
								setIsEditFieldOpen(false);
							}}
						>
							<Close
								className={`w-[25px] h-[25px] transition-all hover:bg-slate-200 p-[5px] rounded-full`}
							/>
						</button>
					</div>
					{editError && <p className="text-red-600">{editError}</p>}
				</div>
			</div>
		);
	} else if (isDeleteFieldOpen) {
		return (
			<div className="flex min-w-[300px] justify-between items-center border-b-[1px]">
				<p className="p-[5px] text-sm">{reminder.content}</p>
				<div className="flex flex-col items-end">
					<div className="flex gap-1">
						<button
							className="flex justify-center items-center"
							onClick={async () => {
								const res: APIResult = await deleteMutation.mutateAsync({
									_id: reminder._id,
								});
								if (!res.success) setDeleteError(res.message);
								if (res.success) setIsDeleteFieldOpen(false);
							}}
						>
							<Check
								className={`w-[25px] h-[25px] transition-all hover:bg-slate-200 p-[5px] rounded-full`}
							/>
						</button>
						<button
							className="flex justify-center items-center"
							onClick={() => setIsDeleteFieldOpen(false)}
						>
							<Close
								className={`w-[25px] h-[25px] transition-all hover:bg-slate-200 p-[5px] rounded-full`}
							/>
						</button>
					</div>
					{deleteError && <p className="text-xs text-red-600">{deleteError}</p>}
					<p className="text-xs">Delete reminder?</p>
				</div>
			</div>
		);
	} else if (!isDeleteFieldOpen && !isEditFieldOpen) {
		return (
			<div className="flex min-w-[300px] justify-between items-center border-b-[1px]">
				<p className="p-2 text-sm">{reminder.content}</p>
				<div className="flex gap-1">
					<button
						className="flex justify-center items-center"
						onClick={() => setIsEditFieldOpen(true)}
					>
						<Pencil
							className={`w-[25px] h-[25px] transition-all hover:bg-slate-200 p-[5px] rounded-full`}
						/>
					</button>
					<button
						className="flex justify-center items-center"
						onClick={() => setIsDeleteFieldOpen(true)}
					>
						<Close
							className={`w-[25px] h-[25px] transition-all hover:bg-slate-200 p-[5px] rounded-full`}
						/>
					</button>
				</div>
			</div>
		);
	}
}
