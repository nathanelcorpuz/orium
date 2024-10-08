"use client";

import url from "@/lib/url";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page({ params }: { params: { email: string } }) {
	const [digits, setDigits] = useState("");
	const router = useRouter();

	interface FormData {
		digits: number;
		email: string;
	}

	const submitMutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/auth/register/verify`, {
				method: "POST",
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
			fetch(`${url}/api/auth/register/code`, {
				method: "POST",
				body: JSON.stringify(formData),
			}).then(async (res) => {
				if (!res.ok) throw new Error(res.statusText);
				return res;
			}),
	});

	return (
		<div className="flex justify-center items-center w-[100%] h-[100%] bg-gray-50">
			<div className="flex w-[500px] flex-col rounded-lg p-8 drop-shadow-xl bg-white gap-6">
				<p className="text-xl font-bold">Verify your email</p>
				<p className="text-sm">Enter the 6 digit code sent to your inbox.</p>
				<input
					className="border rounded-md p-2 text-md"
					name="digits"
					value={digits}
					onChange={(e) => setDigits(e.currentTarget.value)}
				/>
				<button
					className="
          py-3 bg-[#202020] text-white rounded-lg
          w-[100%] hover:bg-[#505050] transition-all"
					onClick={async () => {
						const result: Response = await submitMutation.mutateAsync({
							email: params.email,
							digits: Number(digits),
						});
						if (result.ok) router.push("/");
					}}
				>
					Submit
				</button>
				<p
					className="underline hover:cursor-pointer hover:text-gray-400 transition-all"
					onClick={() => {
						resendMutation.mutate({ email: params.email });
					}}
				>
					Resend code
				</p>
				{submitMutation.isError ? (
					<p className="font-bold text-red-600">
						{submitMutation.error.message}
					</p>
				) : null}
				{resendMutation.isError ? (
					<p className="font-bold text-red-600">
						{resendMutation.error.message}
					</p>
				) : null}
			</div>
		</div>
	);
}
