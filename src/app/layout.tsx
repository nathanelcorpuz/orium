import { ClerkProvider } from "@clerk/nextjs";

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "./provider";
import SideNav from "./_components/SideNav";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Orium Finance Organizer",
	description: "Organize your finances",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<Provider>
					<body
						className={`${geistSans.variable} ${geistMono.variable} antialiased flex h-screen overflow-hidden`}
					>
						<SideNav />
						<main className="w-full h-full p-2 z-[1]">{children}</main>
					</body>
				</Provider>
			</html>
		</ClerkProvider>
	);
}
