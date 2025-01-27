"use client";

import Check from "@/app/_components/_icons/Check";
import Close from "@/app/_components/_icons/Close";
import Pencil from "@/app/_components/_icons/Pencil";
import { APIResult } from "@/lib/types";
import url from "@/lib/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface NameField {
	name: string;
}

export default function NameField({ name }: NameField) {
	const queryClient = useQueryClient();

	const [isNameFieldActive, setIsNameFieldActive] = useState(false);
	const [newName, setNewName] = useState(name);
	const [error, setError] = useState("");

	interface FormData {
		name: string;
	}

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/user`, {
				method: "PUT",
				body: JSON.stringify(formData),
			}).then((res) => {
				return res.json();
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
		},
	});

	return (
		<div className="py-2 bg-white border-b-[1px] border-gray-300 w-[400px] flex items-center justify-between">
			<div className="flex flex-col w-full">
				<p className="text-sm text-slate-400">Name</p>
				<div className="flex items-center justify-between">
					{isNameFieldActive ? (
						<input
							className="border-[1px] border-slate-200 p-2 rounded-md w-[300px]"
							name="name"
							value={newName}
							onChange={(e) => setNewName(e.currentTarget.value)}
						/>
					) : (
						<p>{name}</p>
					)}
					{isNameFieldActive && (
						<div>
							<button
								onClick={async () => {
									const res: APIResult = await mutation.mutateAsync({
										name: newName,
									});
									if (res.success) {
										setError("");
										setIsNameFieldActive(false);
									}
									if (!res.success) setError(res.message);
								}}
							>
								<Check className="w-[35px] h-[35px] rounded-full hover:cursor-pointer transition-all hover:bg-gray-400 p-2" />
							</button>
							<button
								onClick={() => {
									setIsNameFieldActive(false);
									setError("");
								}}
							>
								<Close className="w-[35px] h-[35px] rounded-full hover:cursor-pointer transition-all hover:bg-gray-400 p-2" />
							</button>
						</div>
					)}
					{!isNameFieldActive && (
						<button onClick={() => setIsNameFieldActive(true)}>
							<Pencil className="w-[35px] h-[35px] rounded-full hover:cursor-pointer transition-all hover:bg-gray-400 p-2" />
						</button>
					)}
				</div>
				{error && <p className="text-red-600 font-bold">{error}</p>}
			</div>
		</div>
	);
}
