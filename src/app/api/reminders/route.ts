import { errorHandler } from "@/lib/error";
import { connectDB } from "@/lib/mongodb";
import { verifyToken } from "@/lib/token";
import { NewReminder, Reminder as ReminderType } from "@/lib/types";
import Reminder from "@/models/Reminder";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { userId } = await verifyToken();

		if (!userId)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const newReminder: NewReminder = await request.json();

		await Reminder.create({ userId, content: newReminder.content });

		return new Response("Success");
	} catch (error) {
		return errorHandler(error as Error);
	}
}

export async function GET() {
	try {
		await connectDB();
		const { userId } = await verifyToken();

		if (!userId)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const reminders = await Reminder.find({ userId });

		return NextResponse.json(reminders);
	} catch (error) {
		return errorHandler(error as Error);
	}
}

export async function PUT(request: NextRequest) {
	try {
		await connectDB();

		const { userId } = await verifyToken();

		if (!userId)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const newReminder: ReminderType = await request.json();

		await Reminder.findByIdAndUpdate(newReminder._id, {
			content: newReminder.content,
		});

		return new Response("success");
	} catch (error) {
		return errorHandler(error as Error);
	}
}

export async function DELETE(request: NextRequest) {
	try {
		await connectDB();
		const { userId } = await verifyToken();

		if (!userId)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		const { _id } = await request.json();

		await Reminder.findByIdAndDelete(_id);

		return new Response("success");
	} catch (error) {
		return errorHandler(error as Error);
	}
}
