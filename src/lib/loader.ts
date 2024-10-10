export default function loader() {
	// @ts
	return new Promise((res) => {
		setTimeout(() => {
			res("loaded");
		}, 2000);
	});
}
