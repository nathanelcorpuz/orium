"use client";

import Eye from "@/app/_components/_icons/Eye";
import EyeClosed from "@/app/_components/_icons/EyeClosed";
import { validatePassword } from "@/lib/password";
import { APIResult } from "@/lib/types";
import url from "@/lib/url";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
	const router = useRouter();

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [passwordValidation, setPasswordValidation] = useState([]);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
		useState(false);
	const [confirmPassError, setConfirmPassError] = useState(false);
	const [mutationError, setMutationError] = useState("");

	interface FormData {
		name: string;
		email: string;
		password: string;
	}

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/auth/register`, {
				method: "POST",
				body: JSON.stringify(formData),
			}).then((res) => res.json()),
	});

	return (
		<div className="flex justify-center items-center w-[100%] h-[100%] bg-gray-50">
			<div className="flex w-[500px] flex-col rounded-lg p-8 drop-shadow-xl bg-white gap-6">
				<p className="text-2xl">Sign up</p>
				<div className="border-b-[1px]"></div>
				<div className="flex flex-col">
					<label className="text-sm" htmlFor="name">
						Name
					</label>
					<input
						className="border rounded-md p-2 text-md"
						name="name"
						value={name}
						onChange={(e) => setName(e.currentTarget.value)}
					/>
				</div>
				<div className="flex flex-col">
					<label className="text-sm" htmlFor="email">
						Email
					</label>
					<input
						className="border rounded-md p-2 text-md"
						name="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.currentTarget.value)}
					/>
				</div>
				<div className="flex flex-col">
					<label className="text-sm" htmlFor="password">
						Password
					</label>
					<div className="relative">
						<input
							className="border rounded-md p-2 text-md w-full"
							name="password"
							type={isPasswordVisible ? "text" : "password"}
							value={password}
							onChange={(e) => {
								setPassword(e.currentTarget.value);
								const validatedPassword = validatePassword(
									e.currentTarget.value
								);
								setPasswordValidation(validatedPassword);
							}}
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
					<div className="relative">
						<input
							className="border rounded-md p-2 text-md w-full"
							name="confirmPassword"
							type={isConfirmPasswordVisible ? "text" : "password"}
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.currentTarget.value)}
						/>
						<div
							className="absolute top-0 right-[10px] bottom-0 flex items-center"
							onClick={() => setIsConfirmPasswordVisible((val) => !val)}
						>
							{isConfirmPasswordVisible ? (
								<Eye className="w-[30px] h-[30px] rounded-full hover:bg-slate-300 transition-all cursor-pointer p-1" />
							) : (
								<EyeClosed className="w-[30px] h-[30px] rounded-full hover:bg-slate-300 transition-all cursor-pointer p-1" />
							)}
						</div>
					</div>
					<div>
						{confirmPassError ? (
							<p className="text-red-600 text-sm">Password mismatch</p>
						) : null}
					</div>
				</div>
				<div>
					<button
						disabled={mutation.isPending}
						className={`
					py-3 bg-[#202020] text-white rounded-lg
          w-[100%] hover:bg-[#505050] transition-all					${
						mutation.isPending ? "opacity-[0.5]" : "opacity-100"
					}
					`}
						onClick={async () => {
							if (password !== confirmPassword) setConfirmPassError(true);

							if (password === confirmPassword) setConfirmPassError(false);

							if (
								passwordValidation.length !== 0 ||
								password !== confirmPassword
							)
								return;

							const result: APIResult = await mutation.mutateAsync({
								name,
								email,
								password,
							});

							if (result.success) router.push(`/auth/register/verify/${email}`);
							if (!result.success) setMutationError(result.message);
						}}
					>
						Submit
					</button>
				</div>
				<div>
					<p>
						<Link
							href="/auth/login"
							className="hover:text-gray-500 underline transition-all text-sm"
						>
							Already have an account? Sign in
						</Link>
					</p>
				</div>
				<div>{mutationError && <p>{mutationError}</p>}</div>
			</div>
		</div>
	);
}
