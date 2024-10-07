"use client";

import { validatePassword } from "@/lib/password";
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
	const [passwordValidation, setPasswordValidation] = useState([]);
	const [confirmPassword, setConfirmPassword] = useState("");
	const [confirmPassError, setConfirmPassError] = useState(false);

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
			}),
	});

	return (
		<div className="flex justify-center items-center w-[100%] h-[100%] bg-gray-50">
			<div className="flex w-[500px] flex-col rounded-lg p-8 drop-shadow-xl bg-white gap-6">
				<p className="text-2xl font-bold">Sign up</p>
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
				<div>
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
							)
								return;

							const result = await mutation.mutateAsync({
								name,
								email,
								password,
							});

							if (result.ok) router.push(`/auth/register/verify/${email}`);
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
				<div>{mutation.isError && <p>{mutation.error.message}</p>}</div>
			</div>
		</div>
	);
}
