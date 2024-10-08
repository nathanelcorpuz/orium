export default function generateCode() {
	let digits = "";
	const timestamp = new Date();
	for (let i = 0; i < 6; i++) {
		digits += Math.floor(Math.random() * 10); // Generate a random number between 0 and 9
	}

	const code = String(digits) + String(timestamp);

	return { digits, timestamp, code };
}
