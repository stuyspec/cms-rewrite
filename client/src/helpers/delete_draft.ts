import safe_fetch from "./safe_fetch";

const deleteDraft = async (_id: string, token: string) => {
	console.log("Delete draft", _id);
	const rjson = (await safe_fetch(window.BASE_URL + "/api/db/delete_draft", {
		method: "DELETE",
		headers: {
			"auth-token": token,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ draft_id: _id }),
	})) as { success: boolean };
	if (rjson.success) {
		window.location.replace("/drafts");
	}
};
export default deleteDraft;
