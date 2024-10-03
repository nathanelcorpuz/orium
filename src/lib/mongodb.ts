import mongoose from "mongoose";
const { MONGODB_URI } = process.env;

const env = process.env.NODE_ENV;

const URI =
	env === "production" ? MONGODB_URI : "mongodb://127.0.0.1:27017/orium";

export const connectDB = async () => {
	try {
		const { connection } = await mongoose.connect(URI as string);
		if (connection.readyState === 1) {
			return Promise.resolve(true);
		}
	} catch (error) {
		console.error(error);
		return Promise.reject(error);
	}
};
