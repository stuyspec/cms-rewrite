import React from "react";
import "./draft_id.css";
import { useEffect, useState } from "react";
import store from "../../store";
import Draft from "../../types/Draft";

import {
	// rest of the elements/components imported remain same
	useParams,
} from "react-router-dom";

interface DraftsResponse {
	drafts: Draft[];
	description: string;
}

function genFormattedContributors(contributors: string[]) {
	let formatted = "";
	for (let i = 0; i < contributors.length; i++) {
		let contributor = contributors[i];
		formatted += contributor;

		if (i < contributors.length - 1) {
			formatted += ", ";
		}
	}
	return formatted;
}

function Drafts() {
	const { slug: draft_id } = useParams();
	const [draft, setDraft] = useState<Draft | null>(null);
	const fetchDraft = async () => {
		const r = await fetch(window.BASE_URL + "/api/db/get_drafts", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"auth-token": store.getState().validauthtoken.value,
			},
			body: JSON.stringify({ _id: draft_id }),
		});
		const rjson = (await r.json()) as DraftsResponse;

		setDraft(rjson.drafts[0]);
	};

	useEffect(() => {
		(async () => {
			if (store.getState().validauthtoken.value && draft == null) {
				await fetchDraft();
			} else {
				store.subscribe(async () => {
					if (store.getState().validauthtoken.value) {
						await fetchDraft();
					}
				});
			}
		})();
	});

	return (
		<div>
			<h2>Draft id: {draft_id}</h2>
			{draft ? (
				<div id="draft_data">
					<h2>
						<span>Volume: {draft.volume}</span>
						&nbsp;|&nbsp;
						<span>Issue: {draft.issue}</span>
					</h2>
					<h2>Draft title: {draft.title}</h2>
					<h3>
						Draft authors:&nbsp;
						{genFormattedContributors(draft.contributors)}
					</h3>
					<img className="cover_image" src={draft.cover_image} />
					<h3>By {draft.cover_image_contributor}</h3>
					<div dangerouslySetInnerHTML={{ __html: draft.text }}></div>
				</div>
			) : (
				<div></div>
			)}
		</div>
	);
}

export default Drafts;
