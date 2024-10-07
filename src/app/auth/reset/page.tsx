"use client";

import url from "@/lib/url";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
	const [email, setEmail] = useState("");
	const router = useRouter();

	interface FormData {
		email: string;
	}

	const submitMutation = useMutation({
		mutationFn: (formData: FormData) =>
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
				<p className="text-sm">Enter your registered email to begin.</p>
				<div className="border-b-[1px]"></div>
				<input
					className="border rounded-md p-2 text-md"
					name="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.currentTarget.value)}
				/>
				<button
					className="
          py-3 bg-[#202020] text-white rounded-lg
          w-[100%] hover:bg-[#505050] transition-all"
					onClick={async () => {
						const result: Response = await submitMutation.mutateAsync({
							email,
						});
						if (result.ok) router.push(`/auth/reset/verify/${email}`);
					}}
				>
					Submit
				</button>
				<div className="flex gap-8">
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
				{submitMutation.isError ? (
					<p className="font-bold text-red-600">
						{submitMutation.error.message}
					</p>
				) : null}
			</div>
		</div>
	);
}
