import bcrypt from "bcrypt";
import User, { UserDocument } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { sendEmailVerificationCode } from "@/lib/emails";
import { HydratedDocument } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Preferences from "@/models/Preferences";

export async function POST(request: NextRequest) {
	await connectDB();
	const { name, email, password, currency } = await request.json();

	const emailExists = await User.exists({ email });

	if (emailExists) {
		return NextResponse.json({
			success: false,
			message: "Email already registered",
		});
	}

	const exclusiveEmailList = [
		"pradodeliojr@gmail.com",
		"hrvysnts@yahoo.com",
		"lopez.bobzorex@gmail.com",
		"cezrabebasaca@gmail.com",
		"melisa.hontiveros@gmail.com",
		"poetaetoes15@gmail.com",
		"lefthanded_73@yahoo.com",
		"ralphsabando@gmail.com",
		"tmcc.crisellelambo@gmail.com",
		"frilynfparan@gmail.com",
		"mikecuizon0131@gmail.com",
		"arriane0503@gmail.com",
		"daninediga@gmail.com",
		"mvillahermosajr@gmail.com",
		"patrickastoveza18@gmail.com",
		"torresabigaild321@gmail.com",
		"ser.nthnl@gmail.com",
		"lerelyn.moraleda10@gmail.com",
		"kpcfco017@gmail.com",
		"julius.soriano.mnl@gmail.com",
		"Verdeenmaenareslopes@gmail.com",
		"rosemarie9.devera@gmail.com",
		"Justinepaulinell@gmail.com",
		"escarlandaisyc@gmail.com",
		"nathaneljohncorpuz@gmail.com"
	];

	if (!exclusiveEmailList.includes(email)) {
		return NextResponse.json({
			success: false,
			message:
				"Beta access not found. Please double-check your email or reach out to nathanelcorpuz@gmail.com for more info",
		});
	}

	const newAccountDoc: HydratedDocument<UserDocument> = await User.create({
		name,
		email,
		password: await bcrypt.hash(password, Number(process.env.SALT)),
		isVerified: false,
	});

	await Preferences.create({ userId: newAccountDoc._id, currency });

	await sendEmailVerificationCode({
		userId: newAccountDoc._id,
		userEmail: email,
	});

	return NextResponse.json({ success: true, message: "Account created" });
}
