import "./drafts.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Draft from "../../types/Draft";
import deleteDraft from "../../helpers/delete_draft";
import handle_error from "../../helpers/handle_error";
import safe_fetch from "../../helpers/safe_fetch";
import useAuth from "../../helpers/useAuth";

interface DraftsResponse {
	drafts: Draft[];
	description: string;
}

function Drafts() {
	const { loading, validauthtoken, isAdmin } = useAuth();
	const [drafts, setDrafts] = useState<Draft[] | null>(null);

	const fetchDrafts = async () => {
		const rjson = (await safe_fetch(
			window.BASE_URL + "/api/db/get_drafts",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"auth-token": validauthtoken,
				},
			}
		)) as DraftsResponse;

		setDrafts(rjson.drafts);
	};

	useEffect(() => {
		(async () => {
			if (validauthtoken) {
				await fetchDrafts().catch(handle_error);
			}
		})();
	}, [validauthtoken]);

	if (drafts == null) {
		return <h2>Loading...</h2>
	}

	return (
		<div>
			<h1>All drafts:</h1>
			<section id="drafts-list">
				{(drafts.length > 0) ? (
					drafts.map((item, _) => (
						<div className="draft_quickview" key={item._id}>
							<Link to={"/draft/" + item._id}>
								<h2>{item.title}</h2>
							</Link>
							<p>{item.summary}</p>
							<button
								onClick={() => {
									deleteDraft(item._id, validauthtoken);
								}}
							>
								Delete
							</button>
						</div>
					))
				) : (
					<h2>There have been no drafts!</h2>
				)}
			</section>
		</div>
	);
}

export default Drafts;
