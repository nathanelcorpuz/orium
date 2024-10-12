export type Type = "bill" | "income" | "debt" | "savings" | "extra";

export type Frequency = "monthly" | "bi-weekly" | "weekly" | "15-30";

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Preferences {
	userId: string;
	balanceRanges: number[];
	currency: string;
}

export interface APIResult {
	success: boolean;
	message: string;
}

export interface UserSession {
	name: string;
	id: string;
	email: string;
}

export interface Session {
	user: UserSession;
}

export type SessionType = Session | null;

export interface Bill {
	_id: string;
	userId: string;
	name: string;
	amount: number;
	day: number;
	comments: string;
	transactionIds: [string];
}

export interface NewBill {
	name: string;
	amount: number;
	day: number;
	comments?: string;
	endDate: Date;
}

export interface Income {
	_id: string;
	name: string;
	amount: number;
	frequency: Frequency;
	dayOfWeek: DayOfWeek;
	day: number;
	comments?: string;
}

export interface NewIncome {
	name: string;
	amount: number;
	frequency: Frequency;
	dayOfWeek: DayOfWeek;
	startDate: Date;
	day: number;
	endDate: Date;
	comments?: string;
}

export interface Debt {
	_id: string;
	name: string;
	amount: number;
	day: number;
	startDate: Date;
	endDate: Date;
	comments: string;
}

export interface NewDebt {
	name: string;
	amount: number;
	day: number;
	startDate: Date;
	endDate: Date;
	comments?: string;
}

export interface Extra {
	_id: string;
	name: string;
	amount: number;
	date: Date;
	comments: string;
}

export interface NewExtra {
	name: string;
	amount: number;
	date: Date;
	comments?: string;
}

export interface History {
	_id: string;
	name: string;
	forecastedAmount: number;
	actualAmount: number;
	forecastedDate: Date;
	actualDate: Date;
	type: Type;
	typeId: string;
	forecastedBalance: number;
	actualBalance: number;
}

export interface NewHistory {
	userId: string;
	name: string;
	forecastedAmount: number;
	actualAmount: number;
	forecastedDate: Date;
	actualDate: Date;
	forecastedBalance: number;
	actualBalance: number;
	type: Type;
	typeId: string;
}

export interface Savings {
	_id: string;
	name: string;
	amount: number;
	day: number;
	startDate: Date;
	endDate: Date;
	comments: string;
}

export interface NewSavings {
	name: string;
	amount: number;
	day: number;
	startDate: Date;
	endDate: Date;
	comments?: string;
}

export interface Transaction {
	_id: string;
	userId: string;
	name: string;
	amount: number;
	dueDate: Date;
	type: Type;
	typeId: string;
}

export interface TransactionWithBalance extends Transaction {
	forecastedBalance: number;
}

export interface NewTransaction {
	userId: string;
	name: string;
	amount: number;
	dueDate: Date;
	type: Type;
	typeId: string;
}

export interface Balance {
	_id: string;
	name: string;
	amount: number;
	comments?: string;
}

export interface NewBalance {
	name: string;
	amount: number;
	comments?: string;
}

export interface Reminder {
	_id: string;
	content: string;
	userId: string;
}

export interface NewReminder {
	content: string;
	userId: string;
}
