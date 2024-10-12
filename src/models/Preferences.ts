import mongoose, { Schema, model } from "mongoose";

export interface PreferencesDocument {
	_id: string;
	userId: string;
	currency: string;
	balanceRanges: number[];
}

const PreferencesSchema = new Schema<PreferencesDocument>({
	userId: { type: String, unique: true },
	currency: { type: String, default: "₱" },
	balanceRanges: {
		type: [Number],
		default: [0, 50000, 100000, 150000, 200000],
	},
});

const Preferences =
	mongoose.models?.Preferences ||
	model<PreferencesDocument>("Preferences", PreferencesSchema);
export default Preferences;
