import nodemailer from "nodemailer";

// export const transporter = nodemailer.createTransport({
// 	host: process.env.MAILER_HOST,
// 	port: Number(process.env.MAILER_PORT),
// 	secure: true,
// 	auth: {
// 		user: process.env.MAILER_EMAIL,
// 		pass: process.env.MAILER_PASS,
// 	},
// });
export const transporter = nodemailer.createTransport({
	host: "smtp.ethereal.email",
	port: 587,
	secure: true,
	auth: {
		user: "kellie.reichel@ethereal.email",
		pass: "2bEAbP6yNunAkuckm8",
	},
});
