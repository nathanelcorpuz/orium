"use client";

import { validatePassword } from "@/lib/password";
import url from "@/lib/url";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function ChangePassword() {
	const [password, setPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newPasswordValidation, setNewPasswordValidation] = useState([]);
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [confirmNewPassError, setConfirmNewPassError] = useState(false);

	console.log(`
    password: ${password}
    newPassword: ${newPassword}
    confirmNewPassword: ${confirmNewPassword}
    `);

	const [isFormOpen, setIsFormOpen] = useState(false);

	interface FormData {
		password: string;
		newPassword: string;
	}

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/auth/password/change`, {
				method: "PUT",
				body: JSON.stringify(formData),
			}).then((res) => {
				if (!res.ok) throw new Error(res.statusText);
				return res;
			}),
	});

	return (
		<div>
			<div className="mt-6">
				<button
					className="text-sm underline cursor-pointer hover:text-gray-500 transition-all"
					onClick={() => setIsFormOpen((isOpen) => !isOpen)}
				>
					Change password
				</button>
			</div>
			{isFormOpen && (
				<div className="flex w-full flex-col rounded-lg p-8 border-[1px] border-slate-300 bg-white gap-6 mt-6">
					<div className="flex flex-col">
						<label className="text-sm" htmlFor="password">
							Current Password
						</label>
						<input
							className="border rounded-md p-2 text-md"
							name="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.currentTarget.value)}
						/>
					</div>
					<div className="flex flex-col">
						<label className="text-sm" htmlFor="newPassword">
							New Password
						</label>
						<input
							className="border rounded-md p-2 text-md"
							name="newPassword"
							type="password"
							value={newPassword}
							onChange={(e) => {
								setNewPassword(e.currentTarget.value);
								const validatedPassword = validatePassword(
									e.currentTarget.value
								);
								setNewPasswordValidation(validatedPassword);
							}}
						/>
						<div>
							<ul className="flex flex-col">
								{newPasswordValidation.map((result: string) => (
									<li key={result} className="text-sm text-gray-400 pt-2">
										{result}
									</li>
								))}
							</ul>
						</div>
					</div>
					<div className="flex flex-col">
						<label className="text-sm" htmlFor="confirmNewPassword">
							Confirm New Password
						</label>
						<input
							className="border rounded-md p-2 text-md"
							name="confirmNewPassword"
							type="password"
							value={confirmNewPassword}
							onChange={(e) => {
								setConfirmNewPassword(e.currentTarget.value);
							}}
						/>
						<div>
							{confirmNewPassError ? (
								<p className="text-red-600 text-sm">Password mismatch</p>
							) : null}
						</div>
					</div>
					<div className="flex flex-col gap-2">
						<button
							className="
          py-3 bg-[#202020] text-white rounded-lg
          w-[100%] hover:bg-[#505050] transition-all"
							onClick={async () => {
								if (newPassword !== confirmNewPassword)
									setConfirmNewPassError(true);

								if (newPassword === confirmNewPassword)
									setConfirmNewPassError(false);

								if (
									newPasswordValidation.length !== 0 ||
									newPassword !== confirmNewPassword
								)
									return;

								const result = await mutation.mutateAsync({
									password,
									newPassword,
								});

								if (result.ok) {
									setConfirmNewPassError(false);
									setPassword("");
									setNewPassword("");
									setConfirmNewPassword("");
								}
							}}
						>
							Submit
						</button>
						<button
							className="py-3 bg-[#202020] text-white rounded-lg
          w-[100%] hover:bg-[#505050] transition-all"
							onClick={() => setIsFormOpen(false)}
						>
							Close
						</button>
					</div>
					{mutation.isError && (
						<p className="text-red-600 font-bold">{mutation.error.message}</p>
					)}
					{mutation.isSuccess && (
						<p className="text-green-600 font-bold">Password changed</p>
					)}
				</div>
			)}
		</div>
	);
}
