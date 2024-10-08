"use client";

import Eye from "@/app/_components/_icons/Eye";
import EyeClosed from "@/app/_components/_icons/EyeClosed";
import { validatePassword } from "@/lib/password";
import url from "@/lib/url";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

export default function ChangePassword() {
	const [password, setPassword] = useState("");
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
	const [newPasswordValidation, setNewPasswordValidation] = useState([]);
	const [confirmNewPassword, setConfirmNewPassword] = useState("");
	const [isConfirmNewPasswordVisible, setIsConfirmNewPasswordVisible] =
		useState(false);
	const [confirmNewPassError, setConfirmNewPassError] = useState(false);

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

	const clear = () => {
		setConfirmNewPassError(false);
		setPassword("");
		setNewPassword("");
		setConfirmNewPassword("");
		setNewPasswordValidation([]);
	};

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
				<div className="flex w-full flex-col rounded-lg p-8 border-[1px] border-slate-200 bg-white gap-6 mt-6">
					<div className="flex flex-col">
						<label className="text-sm" htmlFor="password">
							Current Password
						</label>
						<div className="relative">
							<input
								className="border rounded-md p-2 text-md w-full"
								name="password"
								type={isPasswordVisible ? "text" : "password"}
								value={password}
								onChange={(e) => setPassword(e.currentTarget.value)}
							/>
							<div
								className="absolute top-0 right-[10px] bottom-0 flex items-center"
								onClick={() => setIsPasswordVisible((val) => !val)}
							>
								{isPasswordVisible ? (
									<Eye className="w-[30px] h-[30px] rounded-full hover:bg-slate-300 transition-all cursor-pointer p-1" />
								) : (
									<EyeClosed className="w-[30px] h-[30px] rounded-full hover:bg-slate-300 transition-all cursor-pointer p-1" />
								)}
							</div>
						</div>
					</div>
					<div className="flex flex-col">
						<label className="text-sm" htmlFor="newPassword">
							New Password
						</label>
						<div className="relative">
							<input
								className="border rounded-md p-2 text-md w-full"
								name="password"
								type={isNewPasswordVisible ? "text" : "password"}
								value={newPassword}
								onChange={(e) => {
									setNewPassword(e.currentTarget.value);
									const validatedPassword = validatePassword(
										e.currentTarget.value
									);
									setNewPasswordValidation(validatedPassword);
								}}
							/>
							<div
								className="absolute top-0 right-[10px] bottom-0 flex items-center"
								onClick={() => setIsNewPasswordVisible((val) => !val)}
							>
								{isNewPasswordVisible ? (
									<Eye className="w-[30px] h-[30px] rounded-full hover:bg-slate-300 transition-all cursor-pointer p-1" />
								) : (
									<EyeClosed className="w-[30px] h-[30px] rounded-full hover:bg-slate-300 transition-all cursor-pointer p-1" />
								)}
							</div>
						</div>
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
						<div className="relative">
							<input
								className="border rounded-md p-2 text-md w-full"
								name="confirmNewPassword"
								type={isConfirmNewPasswordVisible ? "text" : "password"}
								value={confirmNewPassword}
								onChange={(e) => setConfirmNewPassword(e.currentTarget.value)}
							/>
							<div
								className="absolute top-0 right-[10px] bottom-0 flex items-center"
								onClick={() => setIsConfirmNewPasswordVisible((val) => !val)}
							>
								{isConfirmNewPasswordVisible ? (
									<Eye className="w-[30px] h-[30px] rounded-full hover:bg-slate-300 transition-all cursor-pointer p-1" />
								) : (
									<EyeClosed className="w-[30px] h-[30px] rounded-full hover:bg-slate-300 transition-all cursor-pointer p-1" />
								)}
							</div>
						</div>
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

								if (result.ok) clear();
							}}
						>
							Submit
						</button>
						<button
							className="py-3 bg-[#202020] text-white rounded-lg
          w-[100%] hover:bg-[#505050] transition-all"
							onClick={() => {
								setIsFormOpen(false);
								clear();
							}}
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
