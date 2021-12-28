import React from "react";
import "./draft_id.css";
import { useEffect, useState } from "react";
import store from "../../store";
import Draft from "../../types/Draft";
import upload_image_helper from "../../helpers/upload_image";
import { useParams } from "react-router-dom";
import deleteDraft from "../../helpers/delete_draft";

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
	const [coverImageURL, setCoverImageURL] = useState<string | null>(null);

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

	const submitEdit = async () => {
		console.log("Submit edit");
		const volume = (document.getElementById("edit_volume") as any)?.value;
		const issue = (document.getElementById("edit_issue") as any)?.value;
		const title = (document.getElementById("edit_title") as any)?.value;
		const contributors_str = (
			document.getElementById("edit_contributors") as any
		)?.value;
		const cover_image_contributor = (
			document.getElementById("edit_cover_image_contributor") as any
		)?.value;
		const text = (document.getElementById("edit_text") as any)?.value;

		let contributors: string[] = contributors_str
			? contributors_str.split(",")
			: [];
		contributors = contributors.map((v) => v.trim());

		const section_id = (document.getElementById("edit_section") as any)
			?.value;
		const summary = (document.getElementById("edit_summary") as any)?.value;

		const cover_image_to_use = coverImageURL
			? coverImageURL
			: draft?.cover_image;
		const send = {
			volume,
			issue,
			title,
			contributors: contributors,
			cover_image_contributor: cover_image_contributor,
			text,
			section_id,
			summary,
			cover_image: cover_image_to_use,
		};

		const r = await fetch(window.BASE_URL + "/api/db/update_draft", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"auth-token": store.getState().validauthtoken.value,
			},
			body: JSON.stringify({ draft_id: draft?._id, update: send }),
		});

		const rjson = (await r.json()) as { success: boolean };

		if (rjson.success) {
			location.reload();
		}
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
	const upload_cover_image = async () => {
		// In case event listener remains, or is triggered manually, etc
		const uploaded_files = (
			document.getElementById("upload_cover_image") as any
		).files;
		if (uploaded_files.length > 0) {
			const uploaded_file = uploaded_files[0]; // always grab first
			const public_url = (await upload_image_helper(
				uploaded_file
			)) as string;
			console.log(public_url);
			setCoverImageURL(public_url);
		}
	};

	return (
		<div>
			<h2>Draft id: {draft_id}</h2>
			{draft ? (
				<div>
					<div id="draft_data">
						<h2>
							Volume:&nbsp;
							<input
								type="number"
								id="edit_volume"
								defaultValue={draft.volume}
							/>
							&nbsp;|&nbsp; Issue:&nbsp;
							<input
								type="number"
								id="edit_issue"
								defaultValue={draft.issue}
							/>
						</h2>
						<h2>
							Draft title:&nbsp;
							<input
								type="text"
								id="edit_title"
								defaultValue={draft.title}
							/>
						</h2>
						<h3>
							Draft authors:&nbsp;
							<textarea
								id="edit_contributors"
								defaultValue={genFormattedContributors(
									draft.contributors
								)}
							/>
						</h3>
						<img
							id="cover_image"
							src={
								coverImageURL
									? coverImageURL
									: draft.cover_image
							}
						/>
						<div>
							<input
								type="file"
								accept="image/png, image/jpg, image/jpeg"
								id="upload_cover_image"
							/>
							<button onClick={upload_cover_image}>
								Edit Image
							</button>
						</div>
						<h3>
							Image by&nbsp;
							<input
								type="text"
								id="edit_cover_image_contributor"
								defaultValue={draft.cover_image_contributor}
							/>
						</h3>
						<textarea id="text" defaultValue={draft.text} />
						<h3>
							Section:&nbsp;
							<select
								id="edit_section"
								defaultValue={draft.section_id}
							>
								<option value="0">News</option>
								<option value="1">Features</option>
								<option value="2">Opinions</option>
								<option value="3">Science</option>
								<option value="4">Humor</option>
								<option value="5">Sports</option>
								<option value="6">
									Arts and Entertainment
								</option>
								<option value="7">Media</option>
								<option value="8">Spec+</option>
							</select>
						</h3>
						<h3>
							Summary: &nbsp;
							<textarea
								defaultValue={draft.summary}
								id="edit_summary"
							/>
						</h3>
					</div>
					<button onClick={submitEdit}>Submit the edit</button>
					<button
						onClick={() => {
							deleteDraft(draft._id);
						}}
					>
						Delete
					</button>
				</div>
			) : (
				<div></div>
			)}
		</div>
	);
}

export default Drafts;
