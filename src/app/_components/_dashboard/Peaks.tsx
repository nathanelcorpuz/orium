const data2024 = [
	{
		monthYear: "Jan 2024",
		peak: "187,320.00",
		drop: "42,500.00",
	},
	{
		monthYear: "Feb 2024",
		peak: "204,560.00",
		drop: "33,700.00",
	},
	{
		monthYear: "Mar 2024",
		peak: "221,470.00",
		drop: "59,200.00",
	},
	{
		monthYear: "Apr 2024",
		peak: "175,800.00",
		drop: "25,400.00",
	},
	{
		monthYear: "May 2024",
		peak: "192,300.00",
		drop: "61,800.00",
	},
	{
		monthYear: "Jun 2024",
		peak: "250,000.00",
		drop: "90,200.00",
	},
	{
		monthYear: "Jul 2024",
		peak: "212,450.00",
		drop: "75,300.00",
	},
	{
		monthYear: "Aug 2024",
		peak: "195,780.00",
		drop: "41,600.00",
	},
	{
		monthYear: "Sep 2024",
		peak: "218,500.00",
		drop: "85,000.00",
	},
	{
		monthYear: "Oct 2024",
		peak: "229,400.00",
		drop: "78,900.00",
	},
	{
		monthYear: "Nov 2024",
		peak: "182,900.00",
		drop: "37,400.00",
	},
	{
		monthYear: "Dec 2024",
		peak: "210,750.00",
		drop: "63,200.00",
	},
];

const data2025 = [
	{
		monthYear: "Jan 2025",
		peak: "175,320.00",
		drop: "56,400.00",
	},
	{
		monthYear: "Feb 2025",
		peak: "198,500.00",
		drop: "48,200.00",
	},
	{
		monthYear: "Mar 2025",
		peak: "223,100.00",
		drop: "69,300.00",
	},
	{
		monthYear: "Apr 2025",
		peak: "182,700.00",
		drop: "37,800.00",
	},
	{
		monthYear: "May 2025",
		peak: "210,600.00",
		drop: "72,900.00",
	},
	{
		monthYear: "Jun 2025",
		peak: "240,000.00",
		drop: "88,500.00",
	},
	{
		monthYear: "Jul 2025",
		peak: "229,850.00",
		drop: "62,300.00",
	},
	{
		monthYear: "Aug 2025",
		peak: "195,200.00",
		drop: "44,000.00",
	},
	{
		monthYear: "Sep 2025",
		peak: "215,500.00",
		drop: "90,600.00",
	},
	{
		monthYear: "Oct 2025",
		peak: "230,400.00",
		drop: "78,000.00",
	},
	{
		monthYear: "Nov 2025",
		peak: "187,300.00",
		drop: "40,900.00",
	},
	{
		monthYear: "Dec 2025",
		peak: "205,750.00",
		drop: "55,700.00",
	},
];

export default function Peaks() {
	return (
		<div className="w-[100%] flex h-[500px] flex-col gap-4 bg-white p-6 rounded-lg">
			<p className="text-2xl">Peaks and Drops</p>
			<div className="h-full overflow-auto flex flex-col gap-8 bg-slate-50 rounded-lg p-6">
				<div className="flex items-center gap-4 justify-between">
					<p className="text-gray-400 font-bold text-sm">2024</p>
					{data2024.map((data) => (
						<div className="flex" key={data.monthYear}>
							<div className="flex flex-col gap-2">
								<p className="text-xs text-gray-400">{data.monthYear}</p>
								<div>
									<p className="text-sm">{data.peak}</p>
									<p className="text-sm">{data.drop}</p>
								</div>
							</div>
						</div>
					))}
				</div>
				<div className="flex items-center gap-4 justify-between">
					<p className="text-gray-400 font-bold text-sm">2025</p>
					{data2025.map((data) => (
						<div className="flex" key={data.monthYear}>
							<div className="flex flex-col">
								<p className="text-xs text-gray-400">{data.monthYear}</p>
								<p className="text-sm">{data.peak}</p>
								<p className="text-sm">{data.drop}</p>
							</div>
						</div>
					))}
				</div>
				<div className="flex items-center gap-4 justify-between">
					<p className="text-gray-400 font-bold text-sm">2026</p>
					{data2025.map((data) => (
						<div className="flex" key={data.monthYear}>
							<div className="flex flex-col">
								<p className="text-xs text-gray-400">{data.monthYear}</p>
								<p className="text-sm">{data.peak}</p>
								<p className="text-sm">{data.drop}</p>
							</div>
						</div>
					))}
				</div>
				<div className="flex items-center gap-4 justify-between">
					<p className="text-gray-400 font-bold text-sm">2027</p>
					{data2025.map((data) => (
						<div className="flex" key={data.monthYear}>
							<div className="flex flex-col">
								<p className="text-xs text-gray-400">{data.monthYear}</p>
								<p className="text-sm">{data.peak}</p>
								<p className="text-sm">{data.drop}</p>
							</div>
						</div>
					))}
				</div>
				<div className="flex items-center gap-4 justify-between">
					<p className="text-gray-400 font-bold text-sm">2028</p>
					{data2025.map((data) => (
						<div className="flex" key={data.monthYear}>
							<div className="flex flex-col">
								<p className="text-xs text-gray-400">{data.monthYear}</p>
								<p className="text-sm">{data.peak}</p>
								<p className="text-sm">{data.drop}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
