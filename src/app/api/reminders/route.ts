import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import { NewReminder, Reminder as ReminderType } from "@/lib/types";
import Reminder from "@/models/Reminder";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	await connectDB();
	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const newReminder: NewReminder = await request.json();

	await Reminder.create({ userId: auth.userId, content: newReminder.content });

	return NextResponse.json({ success: true, message: "Reminder created" });
}

export async function GET() {
	await connectDB();
	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const reminders = await Reminder.find({ userId: auth.userId });

	return NextResponse.json(reminders);
}

export async function PUT(request: NextRequest) {
	await connectDB();

	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const newReminder: ReminderType = await request.json();

	await Reminder.findByIdAndUpdate(newReminder._id, {
		content: newReminder.content,
	});

	return NextResponse.json({ success: true, message: "Reminder updated" });
}

export async function DELETE(request: NextRequest) {
	await connectDB();

	const auth = await verifyToken();
	if (!auth.success) return NextResponse.json(auth);

	const { _id } = await request.json();

	await Reminder.findByIdAndDelete(_id);

	return NextResponse.json({ success: true, message: "Reminder deleted" });
}
