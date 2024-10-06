import User from "@/models/User";
import generateCode from "./code";
import { transporter } from "./mailer";

const fromEmail = process.env.MAILER_EMAIL;

export async function sendEmailVerification({
	userId,
	userEmail,
}: {
	userId: string;
	userEmail: string;
}) {
	const { code, digits } = generateCode();

	await User.findByIdAndUpdate(userId, { code });

	await transporter.sendMail({
		from: fromEmail,
		to: userEmail,
		subject: "Verify Your Email",
		html: `
    <p>
    Thank you for signing up.
    </p>
    <p>
    Enter the code below to verify your email.
    </p>
    <p>
    ${digits}
    </p>
    `,
	});
}

export async function sendPasswordChanged({
	userEmail,
}: {
	userEmail: string;
}) {
	await transporter.sendMail({
		from: fromEmail,
		to: userEmail,
		subject: "Your password was changed",
		html: `
    <p>
    Your password was just changed.
    </p>
    <p>
    If you did not do this, please reset your password immediately
    <a target="blank" href="https://orium.vercel.app/reset">here</a> and reach out to us via oriumsupport@gmail.com
    </p>
    `,
	});
}
