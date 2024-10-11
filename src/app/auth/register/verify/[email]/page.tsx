"use client";

import { APIResult } from "@/lib/types";
import url from "@/lib/url";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page({ params }: { params: { email: string } }) {
	const [digits, setDigits] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const queryClient = useQueryClient();

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
				const result: APIResult = await res.json();
				if (result.success) {
					queryClient.invalidateQueries({ queryKey: ["user"] });
				}
				return result;
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
			}).then((res) => res.json()),
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
					disabled={resendMutation.isPending || submitMutation.isPending}
					className={`
          py-3 bg-[#202020] text-white rounded-lg
          w-[100%] hover:bg-[#505050] transition-all
					${
						resendMutation.isPending || submitMutation.isPending
							? "opacity-[0.5]"
							: "opacity-100"
					}
					`}
					onClick={async () => {
						const result: APIResult = await submitMutation.mutateAsync({
							email: params.email,
							digits: Number(digits),
						});
						if (result.success) router.push("/");
						if (!result.success) setError(result.message);
					}}
				>
					Submit
				</button>
				<button
					disabled={submitMutation.isPending || resendMutation.isPending}
					className={`
          py-3 bg-[#202020] text-white rounded-lg
          w-[100%] hover:bg-[#505050] transition-all
					${
						submitMutation.isPending || resendMutation.isPending
							? "opacity-[0.5]"
							: "opacity-100"
					}
					`}
					onClick={async () => {
						const result: APIResult = await resendMutation.mutateAsync({
							email: params.email,
						});
						if (!result.success) setError(result.message);
						if (result.success) setError("");
					}}
				>
					Resend code
				</button>
				{error ? <p className="font-bold text-red-600">{error}</p> : null}
			</div>
		</div>
	);
}
