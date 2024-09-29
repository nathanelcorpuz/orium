import TransactionItem from "./_components/TransactionItem";

const transactions = [
	{
		name: "t1",
		amount: -5000,
	},
	{
		name: "t2",
		amount: 11000,
	},
	{
		name: "t3",
		amount: -300,
	},
];

export default function Forecast() {
	let currentBalance = 23000;
	const transactionsWithBalance = transactions.map((transaction) => {
		currentBalance = currentBalance + transaction.amount;
		return {
			...transaction,
			forecastedBalance: currentBalance,
		};
	});

	return (
		<div className="flex flex-col gap-5">
			<div className="flex gap-2">
				<p>Total balance</p>
				<p>₱23,000</p>
			</div>
			<div>
				<div className="flex font-bold py-2 px-4">
					<div className="w-[20%]">
						<p>Name</p>
					</div>
					<div className="w-[20%]">
						<p>Amount</p>
					</div>
					<div className="w-[20%]">
						<p>Due Date</p>
					</div>
					<div className="w-[20%]">
						<p>Type</p>
					</div>
					<div className="w-[20%]">
						<p>Balance</p>
					</div>
				</div>
				<div className="flex flex-col gap-2">
					{transactionsWithBalance.map((transaction) => (
						<TransactionItem key={transaction.name} transaction={transaction} />
					))}
				</div>
			</div>
		</div>
	);
}
