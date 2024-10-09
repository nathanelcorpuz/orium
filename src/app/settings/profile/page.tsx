"use client";
import url from "@/lib/url";
import { useQuery } from "@tanstack/react-query";
import NameField from "./_components/NameField";
import EmailField from "./_components/EmailField";
import ChangePassword from "./_components/ChangePassword";

export default function Page() {
	const { data, isPending, isError, error } = useQuery({
		queryKey: ["user"],
		queryFn: () =>
			fetch(`${url}/api/user`).then((res) => {
				return res.json();
			}),
	});

	if (isPending) return <p>Loading...</p>;

	return (
		<div className="flex flex-col gap-6 p-10">
			<div className="bg-white p-10 flex flex-col gap-4 rounded-lg drop-shadow-xl overflow-auto overflow-x-hidden">
				<p className="text-2xl mb-2">Profile</p>
				<NameField name={data?.name} />
				<EmailField email={data?.email} />
				<ChangePassword />
			</div>
			{isError && <p>{error.message}</p>}
		</div>
	);
}
