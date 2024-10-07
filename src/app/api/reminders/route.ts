import { connectDB } from "@/lib/mongodb";
import { NewReminder, Reminder as ReminderType } from "@/lib/types";
import Reminder from "@/models/Reminder";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const userId = "";

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const newReminder: NewReminder = await request.json();

	await Reminder.create({ userId, content: newReminder.content });

	return new Response("Success");
}

export async function GET() {
	await connectDB();
	const userId = "";

	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const reminders = await Reminder.find({ userId });

	return NextResponse.json(reminders);
}

export async function PUT(request: NextRequest) {
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const newReminder: ReminderType = await request.json();

	await Reminder.findByIdAndUpdate(newReminder._id, {
		content: newReminder.content,
	});

	return new Response("success");
}

export async function DELETE(request: NextRequest) {
	if (!userId)
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

	const { _id } = await request.json();

	await Reminder.findByIdAndDelete(_id);

	return new Response("success");
}
