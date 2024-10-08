"use client";

import Eye from "@/app/_components/_icons/Eye";
import EyeClosed from "@/app/_components/_icons/EyeClosed";
import url from "@/lib/url";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	interface FormData {
		email: string;
		password: string;
	}

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/auth/login`, {
				method: "POST",
				body: JSON.stringify(formData),
			}).then((res) => {
				return res;
			}),
	});

	return (
		<div className="flex justify-center items-center w-[100%] h-[100%] bg-gray-50">
			<div className="flex w-[500px] flex-col rounded-lg p-8 drop-shadow-xl bg-white gap-6">
				<p className="text-2xl font-bold">Sign in</p>
				<div className="border-b-[1px]"></div>
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
				<div>
					<button
						className="
          py-3 bg-[#202020] text-white rounded-lg
          w-[100%] hover:bg-[#505050] transition-all"
						onClick={async () => {
							const result = await mutation.mutateAsync({ email, password });

							if (!result.ok) setError(result.statusText);
							if (result.ok) router.push("/");
						}}
					>
						Submit
					</button>
				</div>
				<div className="flex gap-8">
					<Link
						href="/auth/register"
						className="hover:text-gray-500 underline transition-all text-sm"
					>
						Create an account
					</Link>
					<div className="h-[25px] w-[1px] border-gray-300 border-r-[1px]"></div>
					<Link
						href="/auth/reset"
						className="hover:text-gray-500 underline transition-all text-sm"
					>
						Forgot password
					</Link>
				</div>
				<div>{error && <p className="text-red-600 font-bold">{error}</p>}</div>
			</div>
		</div>
	);
}
