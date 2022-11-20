import React from "react";
import "./draft_id.css";
import { useEffect, useState } from "react";
import store from "../../store";
import Draft from "../../types/Draft";
import upload_image_helper from "../../helpers/upload_image";
import { useParams } from "react-router-dom";
import deleteDraft from "../../helpers/delete_draft";
import handle_error from "../../helpers/handle_error";
import safe_fetch from "../../helpers/safe_fetch";
import ContributorPopUp from "../../components/ContributorPopUp/ContributorPopUp";

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
	const [selectedContributors, setSelectedContributors] = useState<any>([]);
	const [selectedImageContributors, setSelectedImageContributors] =
		useState<any>([]);

	const fetchDraft = async () => {
		const rjson = (await safe_fetch(
			window.BASE_URL + "/api/db/get_drafts",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"auth-token": store.getState().validauthtoken.value,
				},
				body: JSON.stringify({ _id: draft_id }),
			}
		)) as DraftsResponse;

		setDraft(rjson.drafts[0]);
		setSelectedContributors(rjson.drafts[0].contributors);
		setSelectedImageContributors([rjson.drafts[0].cover_image_contributor]);
	};

	const submitEdit = async () => {
		console.log("Submit edit");
		const volume = (document.getElementById("edit_volume") as any)?.value;
		const issue = (document.getElementById("edit_issue") as any)?.value;
		const title = (document.getElementById("edit_title") as any)?.value;
		const contributors: string[] = selectedContributors.map(
			(c: any) => c._id
		);
		const cover_image_contributor: string = selectedImageContributors.map(
			(c: any) => c._id
		)[0];
		const text = (document.getElementById("edit_text") as any)?.value;

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

		const rjson = (await safe_fetch(
			window.BASE_URL + "/api/db/update_draft",
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"auth-token": store.getState().validauthtoken.value,
				},
				body: JSON.stringify({ draft_id: draft?._id, update: send }),
			}
		)) as { success: boolean };

		if (rjson.success) {
			location.reload();
		}
	};

	useEffect(() => {
		(async () => {
			if (store.getState().validauthtoken.value && draft == null) {
				await fetchDraft().catch(handle_error);
			} else {
				store.subscribe(async () => {
					if (store.getState().validauthtoken.value) {
						await fetchDraft().catch(handle_error);
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

	const publishDraft = async () => {
		console.log("Publish Draft");
		const rjson = await safe_fetch(
			window.BASE_URL + "/api/db/publish_article",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"auth-token": store.getState().validauthtoken.value,
				},
				body: JSON.stringify({ draft_id: draft?._id }),
			}
		);

		if (rjson.article) {
			window.open(
				"https://stuyspecrewrite.vercel.app/article/" +
					rjson.article.slug
			);
			window.location.replace("/drafts");
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

						<ContributorPopUp
							selectedContributors={selectedContributors}
							setSelectedContributors={setSelectedContributors}
							title="Article Contributors:"
						></ContributorPopUp>
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
						<ContributorPopUp
							selectedContributors={selectedImageContributors}
							setSelectedContributors={
								setSelectedImageContributors
							}
							title="Image Contributors:"
							max_contributors={1}
						></ContributorPopUp>
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
					<br />
					<button onClick={publishDraft}>Publish</button>
				</div>
			) : (
				<div></div>
			)}
		</div>
	);
}

export default Drafts;
