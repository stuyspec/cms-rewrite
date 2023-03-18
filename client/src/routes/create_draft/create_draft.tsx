import "./create_draft.css";
import { useState } from "react";
import Draft from "../../types/Draft";
import store from "../../store";
import upload_image_helper from "../../helpers/upload_image";
// import { Editor } from "react-draft-wysiwyg";
// import { Editor } from "../../components/Editor/Editor";
import Editor from "../../components/RichTextEditor/Editor";
// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import { EditorState, convertToRaw } from "draft-js";
// import draftToHtml from "draftjs-to-html";
import { useAppSelector } from "../../hooks";
import safe_fetch from "../../helpers/safe_fetch";
import ContributorPopUp from "../../components/ContributorPopUp/ContributorPopUp";

interface CreateDraftResponse {
	draft: Draft;
	description: string;
}

function Create_Draft() {
	// const [editorState, setEditorState] = useState(EditorState.createEmpty());
	const [coverImageURL, setCoverImageURL] = useState<string | null>(null);
	const [selectedContributors, setSelectedContributors] = useState<any>([]);
	const [selectedImageContributors, setSelectedImageContributors] =
		useState<any>([]);
	const [html, setHTML] = useState("");

	const new_draft_handler = async () => {
		// console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
		console.log("Create new draft");
		const volume: string = (document.getElementById("new_volume") as any)
			.value;
		const issue: string = (document.getElementById("new_issue") as any)
			.value;
		const title: string = (document.getElementById("new_title") as any)
			.value;
		const contributors: string[] = selectedContributors.map(
			(c: any) => c._id
		);
		const cover_image_contributor: string = selectedImageContributors.map(
			(c: any) => c._id
		)[0];

		let text: string = String(html);
		text = text.replace(new RegExp("<p></p>", "g"), ""); // remove breaks between paragraphs
		text = text.replace(new RegExp("\n", "g"), ""); // remove line breaks in the html
		const summary: string = (document.getElementById("new_summary") as any)
			.value;
		const section_id: number = (
			document.getElementById("new_section") as any
		).value;

		const body: any = {
			title: title,
			contributors: contributors,
			text: text,
			volume: volume,
			issue: issue,
			section_id: section_id,
			summary: summary,
		};
		if (coverImageURL && cover_image_contributor) {
			body.cover_image = coverImageURL;
			body.cover_image_contributor = cover_image_contributor;
		}

		console.log({ body });
		const rjson = (await safe_fetch(
			window.BASE_URL + "/api/db/create_draft",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"auth-token": store.getState().validauthtoken.value,
				},
				body: JSON.stringify(body),
			}
		)) as CreateDraftResponse;
		console.log(rjson);
		window.location.replace("/draft/" + rjson.draft._id);
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

	const isapproved = useAppSelector((state) => {
		if (!state.isApproved.value) window.location.href = "/403"; // inefficient, loads page *then* redirects, may need more R&D
		return state.isApproved.value;
	});

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
				<ContributorPopUp
					selectedContributors={selectedContributors}
					setSelectedContributors={setSelectedContributors}
					title="Article Contributors:"
				></ContributorPopUp>
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
				<ContributorPopUp
					selectedContributors={selectedImageContributors}
					setSelectedContributors={setSelectedImageContributors}
					title="Image Contributors:"
					max_contributors={1}
				></ContributorPopUp>
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
				<div className="formattedEditor">
					{/* <Editor
						editorState={editorState}
						toolbarClassName="toolbarClassName"
						wrapperClassName="wrapperClassName"
						editorClassName="editorClassName"
						onEditorStateChange={setEditorState}
					/> */}
					<Editor setHTML={setHTML} />
				</div>
				<input onClick={new_draft_handler} type="submit"></input>
			</div>
		</div>
	);
}

export default Create_Draft;
