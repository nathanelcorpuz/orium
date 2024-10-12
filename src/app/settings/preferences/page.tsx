"use client";

import { useState } from "react";
import RangeModal from "./_components/RangeModal";
import usePreferencesQuery from "@/app/_hooks/usePreferencesQuery";
import CurrencyModal from "./_components/CurrencyModal";

export default function PreferencesPage() {
	const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
	const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);

	const { preferences, isPreferencesPending } = usePreferencesQuery();

	return (
		<div className="flex flex-col gap-6 p-10">
			<div className="bg-white py-10 w-[500px] flex flex-col gap-4 rounded-lg overflow-auto overflow-x-hidden">
				<p className="text-2xl mb-2 px-10">Preferences</p>
				<div>
					{isPreferencesPending ? (
						<p className="text-sm text-slate-400">Loading...</p>
					) : (
						<div className="flex flex-col gap-4 items-start px-6">
							<button
								onClick={() => setIsRangeModalOpen(true)}
								className="p-1 px-4 underline text-sm hover:bg-slate-200 transition-all rounded-full"
							>
								Set balance ranges
							</button>
							<button
								onClick={() => setIsCurrencyModalOpen(true)}
								className="p-1 px-4 underline text-sm hover:bg-slate-200 transition-all rounded-full"
							>
								Set currency
							</button>
						</div>
					)}
				</div>
			</div>

			{isRangeModalOpen && (
				<RangeModal
					ranges={preferences.balanceRanges}
					setModalOpen={setIsRangeModalOpen}
				/>
			)}
			{isCurrencyModalOpen && (
				<CurrencyModal
					currentCurrency={preferences.currency}
					setModalOpen={setIsCurrencyModalOpen}
				/>
			)}
		</div>
	);
}
