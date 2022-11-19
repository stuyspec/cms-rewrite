import "./ContributorPopUp.css";
import React, { useState } from "react";
import safe_fetch from "../../helpers/safe_fetch";
import store from "../../store";

function ContributorPopUp() {
	const [contributors, setContributors] = useState([]);

	const load_contributors = async () => {
		const fuzzy_name = (document.getElementById("new_contributors") as any)
			.value as string;

		if (fuzzy_name != "") {
			const rjson = await safe_fetch(
				window.BASE_URL + "/api/db/get_staff",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"auth-token": store.getState().validauthtoken.value,
					},
					body: JSON.stringify({ fuzzy_name: fuzzy_name }),
				}
			);

			setContributors(rjson.staff);
		} else {
			setContributors([]);
		}
	};

	const submit_contributor_handler = async (e: any) => {
		e.preventDefault();
		await load_contributors();
	};

	const on_type_contributor_handler = async (e: any) => {
		await load_contributors();
	};

	return (
		<div id="contributor_popup_container">
			<div>
				Draft authors:&nbsp;
				<input
					type="text"
					id="new_contributors"
					onChange={on_type_contributor_handler}
				/>
				<ul>
					{contributors.map((v: any) => (
						<li key={v._id}>{v.name}</li>
					))}
				</ul>
			</div>
		</div>
	);
}

export default ContributorPopUp;
