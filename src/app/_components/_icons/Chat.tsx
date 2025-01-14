// icon:chat-fill | Bootstrap https://icons.getbootstrap.com/ | Bootstrap
import * as React from "react";

function Chat(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg fill="white" viewBox="0 0 16 16" height="1em" width="1em" {...props}>
			<path d="M8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6-.097 1.016-.417 2.13-.771 2.966-.079.186.074.394.273.362 2.256-.37 3.597-.938 4.18-1.234A9.06 9.06 0 008 15z" />
		</svg>
	);
}

export default Chat;
