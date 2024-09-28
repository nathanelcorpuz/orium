"use client";
import { useSession } from "next-auth/react";
import Dashboard from "./_components/Dashboard";
import Link from "next/link";

export default function Home() {
	const { status } = useSession();

	return (
		<main className="flex justify-center items-center w-full">
			{status === "authenticated" && <Dashboard />}
			{status === "loading" && <p>Loading...</p>}
			{status === "unauthenticated" && (
				<Link
					href="/login"
					className="border border-solid border-black rounded p-2"
				>
					Sign in
				</Link>
			)}
		</main>
	);
}
