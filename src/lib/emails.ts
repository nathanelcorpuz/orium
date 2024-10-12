import User from "@/models/User";
import generateCode from "./code";
import { transporter } from "./mailer";

const fromEmail = process.env.MAILER_EMAIL;

export async function sendEmailVerificationCode({
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

export async function sendPasswordChangedConfirmation({
	userEmail,
}: {
	userEmail: string;
}) {
	await transporter.sendMail({
		from: fromEmail,
		to: userEmail,
		subject: "Your Password Was Changed",
		html: `
    <p>
    Your password was just changed.
    </p>
    <p>
    If you did not do this, please reach out to oriumsupport@gmail.com to secure your account.
    </p>
    `,
	});
}

export async function sendSignUpSuccess({ userEmail }: { userEmail: string }) {
	await transporter.sendMail({
		from: fromEmail,
		to: userEmail,
		subject: "Welcome to Orium",
		html: `
    <p>
    Thank you for signing up. You are a step closer to getting a clear view of your finances.
    </p>
    <p>
    Need help? Visit the help center or contact us at support@oriumsoftware.com.
    </p>
    `,
	});
}

export async function sendMessage({ message }: { message: string }) {
	await transporter.sendMail({
		from: fromEmail,
		to: fromEmail,
		subject: "Orium Feedback",
		html: `
    <p>
			${message}
		</p>
    `,
	});
}

export async function sendPasswordResetCode({
	userEmail,
}: {
	userEmail: string;
}) {
	const { code, digits } = generateCode();

	await User.findOneAndUpdate({ email: userEmail }, { code });

	await transporter.sendMail({
		from: fromEmail,
		to: userEmail,
		subject: "Reset Your Password",
		html: `
    <p>
    Use the code below to reset your password.
    </p>
    <p>
    ${digits}
    </p>
    <p>
    If you did not do this, please reach out to oriumsupport@gmail.com to secure your account.
    </p>
    `,
	});
}
