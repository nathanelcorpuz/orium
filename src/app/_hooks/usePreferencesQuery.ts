import { Preferences } from "@/lib/types";
import url from "@/lib/url";
import { useQuery } from "@tanstack/react-query";

export default function usePreferencesQuery() {
	const { data, isPending } = useQuery({
		queryKey: ["preferences"],
		queryFn: () => fetch(`${url}/api/preferences`).then((res) => res.json()),
	});

	const preferences: Preferences = data;

	return { preferences, isPreferencesPending: isPending };
}
