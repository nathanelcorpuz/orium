import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
	host: process.env.MAILER_HOST,
	port: Number(process.env.MAILER_PORT),
	secure: true,
	auth: {
		user: process.env.MAILER_EMAIL,
		pass: process.env.MAILER_PASS,
	},
});
