import React from "react";
import "./drafts.css";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import store from "../../store";
import { setToken } from "../../reducers/validAuthToken";

interface DraftsResponse {
	drafts: Draft[];
	description: string;
}

interface Draft {
	_id: string;
	text: string;
	title: string;
	slug: string;
	contributors: string[];
	volume: number;
	issue: number;
	section: string;
	summary: string;
	cover_image: string;
	cover_image_contributor: string;
	drafter_id: string;
}

function Drafts() {
	const [drafts, setDrafts] = useState<Draft[] | null>(null);

	const fetchDrafts = async () => {
		const r = await fetch(window.BASE_URL + "/api/db/get_drafts", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"auth-token": store.getState().validauthtoken.value,
			},
		});
		const rjson = (await r.json()) as DraftsResponse;

		setDrafts(rjson.drafts);
	};

	useEffect(() => {
		(async () => {
			if (store.getState().validauthtoken.value && drafts == null) {
				await fetchDrafts();
			} else {
				store.subscribe(async () => {
					if (store.getState().validauthtoken.value) {
						await fetchDrafts();
					}
				});
			}
		})();
	});

	return (
		<div>
			<h1>All drafts:</h1>

			{drafts != null ? (
				drafts.map((item, index) => <h2 key={index}>{item.title}</h2>)
			) : (
				<></>
			)}
		</div>
	);
}

export default Drafts;
