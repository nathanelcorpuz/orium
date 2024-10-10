export default function loader() {
	return new Promise((res, rej) => {
		setTimeout(() => {
			res("loaded");
		}, 2000);
	});
}
