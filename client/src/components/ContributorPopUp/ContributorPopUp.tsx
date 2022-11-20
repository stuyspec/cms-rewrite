import "./ContributorPopUp.css";
import { useState } from "react";
import safe_fetch from "../../helpers/safe_fetch";
import store from "../../store";

function ContributorPopUp({
	selectedContributors,
	setSelectedContributors,
}: any) {
	const [matchedContributors, setMatchedContributors] = useState<any>([]);

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

			setMatchedContributors(rjson.staff);
		} else {
			setMatchedContributors([]);
		}
	};

	const on_type_contributor_handler = async (e: any) => {
		await load_contributors();
	};

	const select_contributor = async (contributor_index: number) => {
		const selected: any = matchedContributors[contributor_index];

		const doesExist = selectedContributors.find(
			(v: any) => v._id == selected._id
		);
		if (!doesExist) {
			setSelectedContributors([...selectedContributors, selected]);
		}
	};

	const unselect_contributor = async (contributor_index: number) => {
		const selected: any = selectedContributors[contributor_index];

		const newselectedcontributors = selectedContributors.filter(
			(v: any) => v._id != selected._id
		);

		setSelectedContributors(newselectedcontributors);
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
				<div>
					<h3>Matched Contributors: </h3>
					<div id="list_matched_contributors">
						{matchedContributors.map((v: any, index: number) => (
							<div key={v._id}>
								<span>{v.name}</span>
								<button
									className="contributor_button"
									onClick={async () => {
										await select_contributor(index);
									}}
								>
									+
								</button>
							</div>
						))}
					</div>
				</div>
				<div>
					<h3>Chosen Contributors:</h3>
					{selectedContributors.map((v: any, index: number) => (
						<div key={v._id}>
							<span>{v.name}</span>
							<button
								className="contributor_button"
								onClick={async () => {
									await unselect_contributor(index);
								}}
							>
								-
							</button>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default ContributorPopUp;
