"use client";

import Check from "@/app/_components/_common/_icons/Check";
import Close from "@/app/_components/_common/_icons/Close";
import Pencil from "@/app/_components/_common/_icons/Pencil";
import url from "@/lib/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

interface EmailField {
	email: string;
}

export default function EmailField({ email }: EmailField) {
	const queryClient = useQueryClient();

	const [isEmailFieldActive, setIsEmailFieldActive] = useState(false);
	const [newEmail, setNewEmail] = useState(email);

	interface FormData {
		email: string;
	}

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/auth/email`, {
				method: "PUT",
				body: JSON.stringify(formData),
			}).then((res) => {
				if (!res.ok) throw new Error(res.statusText);
				return res.json();
			}),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["user"] });
			setIsEmailFieldActive(false);
		},
	});

	return (
		<div className="py-2 bg-white border-b-[1px] border-gray-300 w-[400px] flex items-center justify-between">
			<div className="flex flex-col w-full">
				<p className="text-sm font-bold">Email</p>
				<div className="flex items-center justify-between">
					{isEmailFieldActive ? (
						<input
							className="border-[1px] border-slate-200 p-2 rounded-md w-[300px]"
							name="name"
							type="email"
							value={newEmail}
							onChange={(e) => setNewEmail(e.currentTarget.value)}
						/>
					) : (
						<p>{email}</p>
					)}
					{isEmailFieldActive && (
						<div>
							<button
								onClick={() => {
									mutation.mutate({ email: newEmail });
								}}
							>
								<Check className="w-[35px] h-[35px] rounded-full hover:cursor-pointer transition-all hover:bg-gray-400 p-2" />
							</button>
							<button
								onClick={() => {
									setIsEmailFieldActive(false);
								}}
							>
								<Close className="w-[35px] h-[35px] rounded-full hover:cursor-pointer transition-all hover:bg-gray-400 p-2" />
							</button>
						</div>
					)}
					{!isEmailFieldActive && (
						<button onClick={() => setIsEmailFieldActive(true)}>
							<Pencil className="w-[35px] h-[35px] rounded-full hover:cursor-pointer transition-all hover:bg-gray-400 p-2" />
						</button>
					)}
				</div>
				{mutation.isError && (
					<p className="text-red-600 font-bold">{mutation.error.message}</p>
				)}
			</div>
		</div>
	);
}
