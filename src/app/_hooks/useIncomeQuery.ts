import loader from "@/lib/loader";
import { Income } from "@/lib/types";
import url from "@/lib/url";
import { useQuery } from "@tanstack/react-query";

export default function useIncomeQuery() {
	const { isPending, data } = useQuery({
		queryKey: ["income"],
		queryFn: () =>
			fetch(`${url}/api/income`).then(async (res) => {
				await loader();
				return res.json();
			}),
	});

	const incomes: Income[] = data;

	let totalMonthlyIncome = 0;

	if (incomes) {
		incomes.forEach((income) => {
			if (income.frequency === "monthly") {
				totalMonthlyIncome = totalMonthlyIncome + income.amount;
			}
			if (income.frequency === "bi-weekly" || income.frequency === "15-30") {
				totalMonthlyIncome = totalMonthlyIncome + income.amount * 2;
			}
			if (income.frequency === "weekly") {
				totalMonthlyIncome = totalMonthlyIncome + income.amount * 4;
			}
		});
	}

	return { incomes, incomePending: isPending, totalMonthlyIncome };
}
