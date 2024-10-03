import { authOptions } from "@/lib/auth";
import {
	NewReminder,
	Reminder as ReminderType,
	SessionType,
} from "@/lib/types";
import Reminder, { ReminderDocument } from "@/models/Reminder";
import User from "@/models/User";
import { HydratedDocument } from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	const session: SessionType = await getServerSession(authOptions);

	if (!session) {
		return new Response("unauthorized");
	}

	const userId = session.user.id;

	const newReminder: NewReminder = await request.json();

	const newReminderDoc: HydratedDocument<ReminderDocument> =
		await Reminder.create({ userId, content: newReminder.content });

	await User.findByIdAndUpdate(userId, {
		$push: { reminderIds: newReminderDoc._id },
	});

	return new Response("Success");
}

export async function GET() {
	const session: SessionType = await getServerSession(authOptions);

	if (!session) {
		return new Response("unauthorized");
	}

	const userId = session.user.id;

	const reminders = await Reminder.find({ userId });

	return NextResponse.json(reminders);
}

export async function PUT(request: NextRequest) {
	const session: SessionType = await getServerSession(authOptions);

	if (!session) {
		return new Response("unauthorized");
	}

	const newReminder: ReminderType = await request.json();

	await Reminder.findByIdAndUpdate(newReminder._id, {
		content: newReminder.content,
	});

	return new Response("success");
}

export async function DELETE(request: NextRequest) {
	const session: SessionType = await getServerSession(authOptions);

	if (!session) {
		return new Response("unauthorized");
	}

	const userId = session.user.id;

	const { _id } = await request.json();

	await Reminder.findByIdAndDelete(_id);

	await User.findByIdAndUpdate(userId, { $pull: { reminderIds: _id } });

	return new Response("success");
}
