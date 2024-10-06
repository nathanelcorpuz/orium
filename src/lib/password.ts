import passwordValidator from "password-validator";

export const validatePassword = (password: string) => {
	const schema = new passwordValidator();
	interface PasswordValidation {
		digits: "At least 1 digit";
		uppercase: "At least 1 uppercase letter";
		lowercase: "At least 1 lowercase letter";
		symbols: "At least 1 symbol";
		min: "At least 8 characters";
		max: "Max of 100 characters";
		spaces: "Must not have spaces";
	}
	schema
		.has()
		.digits(1, "Should have at least 1 digit")
		.has()
		.lowercase(1, "Should have at least 1 lowercase letter")
		.has()
		.uppercase(1, "Should have at least 1 uppercase letter")
		.has()
		.symbols(1, "Should have at least 1 symbol")
		.has()
		.not()
		.spaces(0, "Should have no spaces")
		.is()
		.min(8, "Should have at least 8 characters")
		.is()
		.max(100, "Should have a max of 100 characters");

	const validatedPassword = schema.validate(password, { details: true });

	// @ts-ignore always an array
	return validatedPassword.map((validation) => validation.message);
};
