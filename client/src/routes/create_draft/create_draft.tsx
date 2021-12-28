import React from "react";
import "./create_draft.css";
import { useEffect, useState } from "react";
import Draft from "../../types/Draft";
import store from "../../store";
import upload_image_helper from "../../helpers/upload_image";

interface CreateDraftResponse {
	draft: Draft;
	description: string;
}

function Create_Draft() {
	const [coverImageURL, setCoverImageURL] = useState<string | null>(null);

	const new_draft_handler = async () => {
		console.log("Create new draft");
		const volume: string = (document.getElementById("new_volume") as any)
			.value;
		const issue: string = (document.getElementById("new_issue") as any)
			.value;
		const title: string = (document.getElementById("new_title") as any)
			.value;
		const contributors: string[] = (
			(document.getElementById("new_title") as any).value as string
		).split(", ");
		const cover_image_contributor: string = (
			document.getElementById("new_cover_image_contributor") as any
		).value;
		const text: string = (document.getElementById("new_text") as any).value;
		const summary: string = (document.getElementById("new_summary") as any)
			.value;
		const section_id: number = (
			document.getElementById("new_section") as any
		).value;

		const body = {
			title: title,
			contributors: contributors,
			text: text,
			volume: volume,
			issue: issue,
			section_id: section_id,
			summary: summary,
			cover_image: coverImageURL,
			cover_image_contributor: cover_image_contributor,
		};
		if (coverImageURL) {
			console.log({ body });
			const r = await fetch("http://127.0.0.1:5678/api/db/create_draft", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"auth-token": store.getState().validauthtoken.value,
				},
				body: JSON.stringify(body),
			});

			const rjson = (await r.json()) as CreateDraftResponse;
			console.log(rjson);
			window.location.replace("/draft/" + rjson.draft._id);
		}
	};

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
			setCoverImageURL(public_url);
		}
	};

	return (
		<div>
			<h1>Create Draft</h1>
			<div id="new_draft_fom">
				<h2>
					Volume:&nbsp;
					<input type="number" id="new_volume" />
					&nbsp;|&nbsp; Issue:&nbsp;
					<input type="number" id="new_issue" />
				</h2>
				<h2>
					Draft title:&nbsp;
					<input type="text" id="new_title" />
				</h2>
				<h3>
					Draft authors:&nbsp;
					<input type="text" id="new_contributors" />
				</h3>
				<div>
					<input
						type="file"
						accept="image/png, image/jpg, image/jpeg"
						id="upload_cover_image"
					/>
					<button onClick={upload_cover_image}>Upload Image</button>
				</div>
				{coverImageURL ? (
					<img id="cover_image" src={coverImageURL} />
				) : (
					<></>
				)}

				<h3>
					Image by&nbsp;
					<input type="text" id="new_cover_image_contributor" />
				</h3>
				<h3>
					Summary: &nbsp;
					<textarea id="new_summary" />
				</h3>
				<h3>Section:&nbsp;</h3>
				<select id="new_section">
					<option value="0">News</option>
					<option value="1">Features</option>
					<option value="2">Opinions</option>
					<option value="3">Science</option>
					<option value="4">Humor</option>
					<option value="5">Sports</option>
					<option value="6">Arts and Entertainment</option>
					<option value="7">Media</option>
					<option value="8">Spec+</option>
				</select>
				<h3>The article text:</h3>
				<textarea id="new_text" />
				<input onClick={new_draft_handler} type="submit"></input>
			</div>
		</div>
	);
}

export default Create_Draft;
