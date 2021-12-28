import store from "../store";

const deleteDraft = async (_id: string) => {
	console.log("Delete draft", _id);
	const r = await fetch(window.BASE_URL + "/api/db/delete_draft", {
		method: "DELETE",
		headers: {
			"auth-token": store.getState().validauthtoken.value,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ draft_id: _id }),
	});
	const rjson = (await r.json()) as { success: boolean };
	if (rjson.success) {
		window.location.replace("/drafts");
	}
};
export default deleteDraft;
