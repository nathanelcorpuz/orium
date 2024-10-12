"use client";

import url from "@/lib/url";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";

interface MessageType {
	setModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function Message({ setModalOpen }: MessageType) {
	const [message, setMessage] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	interface FormData {
		message: string;
	}

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			fetch(`${url}/api/user/message`, {
				method: "POST",
				body: JSON.stringify(formData),
			}).then((res) => res.json()),
	});

	const onSubmit = async () => {
		const result = await mutation.mutateAsync({
			message: `${name} - ${email} - ${message}`,
		});

		if (result.success) setModalOpen(false);
	};

	return (
		<div className="absolute right-[100px] w-[500px] p-10 bottom-[100px] rounded-lg bg-slate-600 z-[99] flex flex-col gap-6">
			<div>
				<p className="text-white text-2xl font-light">
					Found a bug or need help?
				</p>
			</div>
			<p className="text-slate-400 text-sm">
				Send us a message and we'll get back to you within 1 business day.
			</p>
			<div className="flex flex-col justify-center gap-4">
				<div className="flex flex-col">
					<p className="text-sm text-slate-400">Name (optional)</p>
					<input
						className="border-[1px] h-[40px] p-2 rounded-md"
						value={name}
						onChange={(e) => setName(e.currentTarget.value)}
					/>
				</div>

				<div className="flex flex-col">
					<p className="text-sm text-slate-400">Email (optional)</p>
					<input
						className="border-[1px] h-[40px] p-2 rounded-md"
						value={email}
						onChange={(e) => setEmail(e.currentTarget.value)}
					/>
				</div>

				<div className="flex flex-col">
					<p className="text-sm text-slate-400">Message</p>
					<textarea
						className="h-[200px] rounded-lg p-2 border-none resize-none"
						value={message}
						onChange={(e) => setMessage(e.currentTarget.value)}
					/>
				</div>
			</div>
			<div className="flex justify-between">
				<button
					onClick={() => setModalOpen(false)}
					className={`border-none h-[45px] w-[150px] border-[1px] rounded-md transition-all bg-slate-500 text-white hover:bg-slate-400 ${
						mutation.isPending ? "opacity-[0.5]" : "opacity-100"
					}`}
				>
					Close
				</button>
				<button
					onClick={onSubmit}
					className={`border-none h-[45px] w-[150px] border-[1px] rounded-md transition-all bg-slate-500 text-white hover:bg-slate-400 ${
						mutation.isPending ? "opacity-[0.5]" : "opacity-100"
					}`}
				>
					Submit
				</button>
			</div>
		</div>
	);
}
