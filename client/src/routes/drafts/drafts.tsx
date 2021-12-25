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
	const [drafts, setDrafts] = useState<Draft[]>([]);
	useEffect(() => {
		(async () => {
			store.subscribe(async () => {
				if (store.getState().validauthtoken.value) {
					const r = await fetch(
						window.BASE_URL + "/api/db/get_drafts",
						{
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"auth-token":
									store.getState().validauthtoken.value,
							},
						}
					);
					const rjson = (await r.json()) as DraftsResponse;

					setDrafts(rjson.drafts);
				}
			});
		})();
	});

	return (
		<div>
			<h1>All drafts:</h1>
			{drafts.map((item, index) => (
				<h2 key={index}>{item.title}</h2>
			))}
		</div>
	);
}

export default Drafts;
