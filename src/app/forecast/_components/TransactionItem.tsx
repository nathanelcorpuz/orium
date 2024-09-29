interface Transaction {
	name: string;
	amount: number;
	forecastedBalance: number;
}

interface TransactionType {
	transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionType) {
	return (
		<div className="flex py-1 px-4 border-b-[1px] border-b-slate-300">
			<div className="w-[20%]">
				<p>{transaction.name}</p>
			</div>
			<div className="w-[20%]">
				<p>{transaction.amount}</p>
			</div>
			<div className="w-[20%]">
				<p>Sep 9, 2024</p>
			</div>
			<div className="w-[20%]">
				<p>Bill</p>
			</div>
			<div className="w-[20%]">
				<p>{transaction.forecastedBalance}</p>
			</div>
		</div>
	);
}
