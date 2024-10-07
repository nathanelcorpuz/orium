"use client";
import url from "@/lib/url";
import { useQuery } from "@tanstack/react-query";
import NameField from "./_components/NameField";
import EmailField from "./_components/EmailField";

export default function Page() {
	const { data, isPending, isError, error } = useQuery({
		queryKey: ["user"],
		queryFn: () =>
			fetch(`${url}/api/user`).then(async (res) => {
				if (!res.ok) throw new Error(res.statusText);
				return res.json();
			}),
	});

	if (isPending) return <p>Loading...</p>;

	return (
		<div className="flex flex-col gap-6 p-10">
			<div className="bg-white p-10 flex flex-col gap-4 rounded-lg drop-shadow-xl">
				<p className="text-2xl mb-2 font-bold">Profile</p>
				<NameField name={data?.name} />
				<EmailField email={data?.email} />
				<div className="mt-6">
					<button className="text-sm underline cursor-pointer hover:text-gray-500 transition-all">
						Change password
					</button>
				</div>
			</div>
			{isError && <p>{error.message}</p>}
		</div>
	);
}
