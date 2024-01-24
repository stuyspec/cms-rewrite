import "./draft_id.css";
import { useEffect, useState } from "react";
import Draft from "../../types/Draft";
import upload_image_helper from "../../helpers/upload_image";
import { useNavigate, useParams } from "react-router-dom";
import deleteDraft from "../../helpers/delete_draft";
import handle_error from "../../helpers/handle_error";
import safe_fetch from "../../helpers/safe_fetch";
import ContributorPopUp from "../../components/ContributorPopUp/ContributorPopUp";
import Editor from "../../components/RichTextEditor/Editor";
import useAuth from "../../helpers/useAuth";

interface DraftsResponse {
	drafts: Draft[];
	description: string;
}

function EditDraftPage() {
	const navigate = useNavigate();
	const { loading, validauthtoken, isAdmin } = useAuth();
	const { slug: draft_id } = useParams();

	const [draft, setDraft] = useState<Draft | null>(null);
	const [coverImageURL, setCoverImageURL] = useState<string | null>(null);
	const [selectedContributors, setSelectedContributors] = useState<any>([]);
	const [selectedImageContributors, setSelectedImageContributors] =
		useState<any>([]);
	const [html, setHTML] = useState("");
	const [subSection, setSubSection] = useState<string>("");
	const subSections = [
		"art",
		"theater",
		"stc",
		"financial-literacy",
		"comics",
		"music",
		"voices",
		"sports-at-stuyvesant",
		"campaign-coverage",
		"1031-terror-attack",
		"black-lives-matter",
		"professional-sports",
		"film",
		"literature",
		"spooktator",
		"disrespectator",
		"staff-editorials",
		"television",
		"fashion",
		"lifestuyle",
		"culture",
		"food",
		"thinkpiece",
		"9-11",
		"sing!",
	]; // todo: dynamic definition

	const fetchDraft = async () => {
		const rjson = (await safe_fetch(
			window.BASE_URL + "/api/db/get_drafts",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"auth-token": validauthtoken,
				},
				body: JSON.stringify({ _id: draft_id }),
			}
		)) as DraftsResponse;

		setDraft(rjson.drafts[0]);
		setSelectedContributors(rjson.drafts[0].contributors);
		setSelectedImageContributors(
			rjson.drafts[0].cover_image_contributor
				? [rjson.drafts[0].cover_image_contributor]
				: []
		);
		setSubSection(rjson.drafts[0].sub_section || "");
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

		const section_id = (document.getElementById("edit_section") as any)
			?.value;
		const summary = (document.getElementById("edit_summary") as any)?.value;

		const send: any = {
			volume,
			issue,
			title,
			contributors: contributors,
			text: html,
			section_id,
			summary,
		};
		if (subSection) {
			send.sub_section = subSection;
		}
		const cover_image_to_use = coverImageURL
			? coverImageURL
			: draft?.cover_image;
		if (cover_image_to_use && cover_image_contributor) {
			send.cover_image = cover_image_to_use;
			send.cover_image_contributor = cover_image_contributor;
		}

		const rjson = (await safe_fetch(
			window.BASE_URL + "/api/db/update_draft",
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					"auth-token": validauthtoken,
				},
				body: JSON.stringify({ draft_id: draft?._id, update: send }),
			}
		)) as { success: boolean };

		if (rjson.success) {
			console.log("Suceess! Reloading.");
			navigate(0)
		}
	};

	useEffect(() => {
		(async () => {
			if (validauthtoken) {
				await fetchDraft().catch(handle_error);
			}
		})();
	}, [validauthtoken]);
	const upload_cover_image = async () => {
		// In case event listener remains, or is triggered manually, etc
		const uploaded_files = (
			document.getElementById("upload_cover_image") as any
		).files;
		if (uploaded_files.length > 0) {
			const uploaded_file = uploaded_files[0]; // always grab first
			const public_url = (await upload_image_helper(
				uploaded_file, validauthtoken
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
					"auth-token": validauthtoken,
				},
				body: JSON.stringify({ draft_id: draft?._id }),
			}
		);

		if (rjson.article) {
			window.open("https://stuyspec.com/article/" + rjson.article.slug);
			window.location.replace("/");
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
								onChange={upload_cover_image}
							/>
						</div>

						<ContributorPopUp
							selectedContributors={
								selectedImageContributors.length > 0
									? selectedImageContributors
									: []
							}
							setSelectedContributors={
								setSelectedImageContributors
							}
							title="Image Contributors:"
							max_contributors={1}
						></ContributorPopUp>
						{/* <textarea id="text" defaultValue={draft.text} /> */}
						<div className="formattedEditor">
							<Editor setHTML={setHTML} htmlString={draft.text} />
						</div>
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
							sub_section: &nbsp;
							<select
								onChange={(e) => {
									setSubSection(e.target.value);
								}}
								value={subSection}
							>
								<option value="" />
								{subSections.map((v_substr: string) => {
									return (
										<option key={v_substr} value={v_substr}>
											{v_substr}
										</option>
									);
								})}
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
					<button id="submit_edit_button" onClick={submitEdit}>
						Submit the edit
					</button>
					<br />
					<button
						onClick={() => {
							deleteDraft(draft._id, validauthtoken);
						}}
					>
						Delete
					</button>
					<br />
					{isAdmin ? (
						<button id="publish_button" onClick={publishDraft}>
							Publish
						</button>
					) : (
						<></>
					)}
				</div>
			) : (
				<div></div>
			)}
		</div>
	);
}

export default EditDraftPage;
