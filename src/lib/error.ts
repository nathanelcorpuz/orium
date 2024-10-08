export const errorHandler = (error: Error) => {
	console.log("\n\n");
	console.log("ERROR!!");
	console.log(error);
	console.log("\n\n");
	return new Response(JSON.stringify({ message: error.message }), {
		status: 500,
		statusText: error.message,
	});
};
