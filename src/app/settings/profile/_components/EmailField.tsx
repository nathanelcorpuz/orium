"use client";

import Check from "@/app/_components/_icons/Check";
import Close from "@/app/_components/_icons/Close";
import Pencil from "@/app/_components/_icons/Pencil";
import { APIResult } from "@/lib/types";
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
	const [error, setError] = useState("");

	interface FormData {
		email: string;
	}

	const clear = () => {
		setError("");
	};

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/auth/email`, {
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
								onClick={async () => {
									const res: APIResult = await mutation.mutateAsync({
										email: newEmail,
									});
									if (!res.success) setError(res.message);
									if (res.success) {
										setIsEmailFieldActive(false);
										clear();
									}
								}}
							>
								<Check className="w-[35px] h-[35px] rounded-full hover:cursor-pointer transition-all hover:bg-gray-400 p-2" />
							</button>
							<button
								onClick={() => {
									clear();
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
				{error && <p className="text-red-600 font-bold">{error}</p>}
			</div>
		</div>
	);
}
