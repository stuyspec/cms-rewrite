import store from "../store";
import { setError } from "../reducers/error";

export default async function safe_fetch(
	input: string,
	init: Object,
	popup: boolean = true
) {
	/*
	 * A wrapper around the native fetch() function that catches errors (both in the request, and the response).
	 * By default, writes to the error state in the Redux store, triggering an error popup. (can be disabled with popup = false)
	 * Throws errors if errors are encountered (which can be caught by the caller).
	 *
	 * Returns the response JSON if successful.
	 */
	let error = undefined;
	const r = await fetch(input, init).catch((err) => {
		error = err;
		// in the case of a (network) error on the request, fudge up an object compatible with the popup maker
		return {
			ok: false,
			json: async () => {
				return { message: err.toString() };
			},
		};
	});

	if (!r.ok && popup) {
		store.dispatch(
			setError(
				await r.json().then((res) => {
					error = Error(res.message);
					return res.message;
				})
			)
		);
	}
	if (error) {
		throw error;
	}
	return await r.json();
}
