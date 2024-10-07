"use client";

import { validatePassword } from "@/lib/password";
import url from "@/lib/url";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page({ params }: { params: { email: string } }) {
	const [digits, setDigits] = useState("");
	const [password, setPassword] = useState("");
	const [passwordValidation, setPasswordValidation] = useState([]);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [confirmPassError, setConfirmPassError] = useState(false);
	const router = useRouter();

	interface FormData {
		digits: number;
		email: string;
		newPassword: string;
	}

	const submitMutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/auth/password/reset/verify`, {
				method: "PUT",
				body: JSON.stringify(formData),
			}).then(async (res) => {
				if (!res.ok) throw new Error(res.statusText);
				return res;
			}),
	});

	interface ResendFormData {
		email: string;
	}

	const resendMutation = useMutation({
		mutationFn: (formData: ResendFormData) =>
			fetch(`${url}/api/auth/password/reset`, {
				method: "PUT",
				body: JSON.stringify(formData),
			}).then(async (res) => {
				if (!res.ok) throw new Error(res.statusText);
				return res;
			}),
	});

	return (
		<div className="flex justify-center items-center w-[100%] h-[100%] bg-gray-50">
			<div className="flex w-[500px] flex-col rounded-lg p-8 drop-shadow-xl bg-white gap-6">
				<p className="text-xl font-bold">Reset your password</p>
				<p className="text-sm">
					Enter the 6 digit code from your inbox and your new password
				</p>
				<div className="border-b-[1px]"></div>
				<div className="flex flex-col">
					<label className="text-sm" htmlFor="digits">
						6 Digit Code
					</label>
					<input
						className="border rounded-md p-2 text-md"
						name="digits"
						value={digits}
						onChange={(e) => setDigits(e.currentTarget.value)}
					/>
				</div>
				<div className="flex flex-col">
					<label className="text-sm" htmlFor="password">
						Password
					</label>
					<input
						className="border rounded-md p-2 text-md"
						name="password"
						type="password"
						value={password}
						onChange={(e) => {
							setPassword(e.currentTarget.value);
							const validatedPassword = validatePassword(e.currentTarget.value);
							setPasswordValidation(validatedPassword);
						}}
					/>
					<div>
						<ul className="flex flex-col">
							{passwordValidation.map((result: string) => (
								<li key={result} className="text-sm text-gray-400 pt-2">
									{result}
								</li>
							))}
						</ul>
					</div>
				</div>
				<div className="flex flex-col">
					<label className="text-sm" htmlFor="confirmPassword">
						Confirm Password
					</label>
					<input
						className="border rounded-md p-2 text-md"
						name="confirmPassword"
						type="password"
						value={confirmPassword}
						onChange={(e) => {
							setConfirmPassword(e.currentTarget.value);
						}}
					/>
					<div>
						{confirmPassError ? (
							<p className="text-red-600 text-sm">Password mismatch</p>
						) : null}
					</div>
				</div>
				<button
					className="
          py-3 bg-[#202020] text-white rounded-lg
          w-[100%] hover:bg-[#505050] transition-all"
					onClick={async () => {
						if (password !== confirmPassword) setConfirmPassError(true);

						if (password === confirmPassword) setConfirmPassError(false);

						if (
							passwordValidation.length !== 0 ||
							password !== confirmPassword
						) {
							return;
						}
						const result: Response = await submitMutation.mutateAsync({
							digits: Number(digits),
							email: params.email,
							newPassword: password,
						});
						if (result.ok) router.push("/");
					}}
				>
					Submit
				</button>
				<div className="flex gap-8">
					<p
						className="hover:text-gray-500 underline transition-all text-sm hover:cursor-pointer"
						onClick={() => resendMutation.mutate({ email: params.email })}
					>
						Resend code
					</p>{" "}
					<div className="h-[25px] w-[1px] border-gray-300 border-r-[1px]"></div>
					<Link
						href="/auth/register"
						className="hover:text-gray-500 underline transition-all text-sm"
					>
						Sign up
					</Link>
					<div className="h-[25px] w-[1px] border-gray-300 border-r-[1px]"></div>
					<Link
						href="/auth/login"
						className="hover:text-gray-500 underline transition-all text-sm"
					>
						Sign in
					</Link>
				</div>
				{resendMutation.isSuccess ? (
					<p className="font-bold">Code re-sent</p>
				) : null}
				{submitMutation.isError ? (
					<p className="font-bold text-red-600">
						{submitMutation.error.message}
					</p>
				) : null}
				{resendMutation.isError && !resendMutation.isSuccess ? (
					<p className="font-bold text-red-600">
						{resendMutation.error.message}
					</p>
				) : null}
			</div>
		</div>
	);
}
