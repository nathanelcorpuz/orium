import { Bill } from "@/lib/types";
import { format } from "date-fns";

interface BillItem {
	bill: Bill;
}

export default function BillItem({ bill }: BillItem) {
	return (
		<div className="flex py-2 px-4 border-b-[1px] border-b-black border-opacity-[0.1] hover:bg-slate-50 hover:cursor-pointer">
			<div className="w-[20%]">
				<p>{bill.name}</p>
			</div>
			<div className="w-[20%]">
				<p>{bill.amount}</p>
			</div>
			<div className="w-[20%]">
				<p>{bill.day}</p>
			</div>
			<div className="w-[20%]">
				<p>{bill.comments}</p>
			</div>
		</div>
	);
}
