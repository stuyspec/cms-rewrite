import React from "react";
import "./drafts.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import store from "../../store";
import Draft from "../../types/Draft";
import deleteDraft from "../../helpers/delete_draft";
import handle_error from "../../helpers/handle_error";
import safe_fetch from "../../helpers/safe_fetch";

interface DraftsResponse {
	drafts: Draft[];
	description: string;
}

function Drafts() {
	const [drafts, setDrafts] = useState<Draft[] | null>(null);

	const fetchDrafts = async () => {
		const rjson = (await safe_fetch(window.BASE_URL + "/api/db/get_drafts", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"auth-token": store.getState().validauthtoken.value,
			},
		})) as DraftsResponse;

		setDrafts(rjson.drafts);
	};

	useEffect(() => {
		(async () => {
			console.log(store.getState().validauthtoken.value);
			if (store.getState().validauthtoken.value && drafts == null) {
				await fetchDrafts().catch(handle_error);
			} else {
				store.subscribe(async () => {
					// TODO: optimize this subscription to reduce redundant requests (which happens a lot with the error state being in the store)
					// how 2 ddos server 101: access this page with an unauthorized account
					// which proceeds to get Forbiddens
					// and due to the error state changes, it proceeds to do that on loop
					// idea: set client-side cooldown, where cached draft is not invalidated for (at least a second?)
					// ideally a server-side ratelimit is added too to avoid pain and suffering
					if (store.getState().validauthtoken.value) {
						await fetchDrafts().catch(handle_error);
					}
				});
			}
		})();
	});

	let genDrafts: any = <></>;
	if (drafts != null) {
		genDrafts =
			drafts.length > 0 ? (
				drafts.map((item, _) => (
					<div className="draft_quickview" key={item._id}>
						<Link to={"/draft/" + item._id}>
							<h2>{item.title}</h2>
							<h3>{item.summary}</h3>
						</Link>
						<button
							onClick={() => {
								deleteDraft(item._id);
							}}
						>
							Delete
						</button>
					</div>
				))
			) : (
				<h2>There have been no drafts!</h2>
			);
	}

	return (
		<div>
			<h1>All drafts:</h1>
			{genDrafts}
		</div>
	);
}

export default Drafts;
