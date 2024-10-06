"use client";

import url from "@/lib/url";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

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
				if (!res.ok) throw new Error(res.statusText);
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
					<input
						className="border rounded-md p-2 text-md"
						name="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.currentTarget.value)}
					/>
				</div>
				<div>
					<button
						className="
          py-3 bg-[#202020] text-white rounded-lg
          w-[100%] hover:bg-[#505050] transition-all"
						onClick={async () => {
							const result = await mutation.mutateAsync({ email, password });
							console.log(result);
							if (result.ok) router.push("/");
						}}
					>
						Submit
					</button>
				</div>
				<div>
					<p>
						Not registered? Sign up{" "}
						<Link
							href="/auth/register"
							className="hover:text-gray-500 underline transition-all"
						>
							here
						</Link>
						.
					</p>
				</div>
				<div>
					{mutation.isError && (
						<p className="text-red-600 font-bold">{mutation.error.message}</p>
					)}
				</div>
			</div>
		</div>
	);
}
