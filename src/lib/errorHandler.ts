import { NextResponse } from "next/server";

export const errorHandler = (error: Error) => {
	console.log("\n\n");
	console.log("ERROR!!");
	console.log(error);
	console.log("\n\n");
	return new NextResponse(JSON.stringify(error.message), {
		status: 500,
		statusText: error.message,
	});
};
