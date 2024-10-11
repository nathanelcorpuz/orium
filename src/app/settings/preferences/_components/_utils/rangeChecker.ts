import { Dispatch, SetStateAction } from "react";

interface Ranges {
	danger: number;
	low: number;
	medium: number;
	high: number;
	higher: number;
}

interface RangeErrorSetters {
	setDangerError: Dispatch<SetStateAction<string>>;
	setLowError: Dispatch<SetStateAction<string>>;
	setMediumError: Dispatch<SetStateAction<string>>;
	setHighError: Dispatch<SetStateAction<string>>;
	setHigherError: Dispatch<SetStateAction<string>>;
}

export default function checkRanges(
	{ danger, low, medium, high, higher }: Ranges,
	{
		setDangerError,
		setLowError,
		setMediumError,
		setHighError,
		setHigherError,
	}: RangeErrorSetters
) {
	if (danger === undefined) console.log("danger is undefined");

	if (danger > low || danger > medium || danger > high) {
		setDangerError(
			"Danger amount should not be higher than any other balance range"
		);
		return { success: false };
	} else setDangerError("");

	if (low > medium || low > high) {
		console.log("checks here");
		setLowError(
			"Low amount should not be greater than any of the upper balance ranges"
		);
		return { success: false };
	} else setLowError("");

	if (medium > high) {
		setMediumError(
			"Medium amount should not be greater than the upper balance ranges"
		);
		return { success: false };
	} else setMediumError("");

	if (high > higher) {
		setHighError(
			"High amount should not be greater than the higher balance range"
		);
		return { success: false };
	} else setHighError("");

	if (higher < high || higher < medium || higher < low || higher < danger) {
		setHigherError(
			"Higher amount should not be less than any of the lower balance ranges"
		);
		return { success: false };
	} else setHigherError("");

	return { success: true };
}
