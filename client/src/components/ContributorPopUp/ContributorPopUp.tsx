import "./ContributorPopUp.css";
import { useState } from "react";
import safe_fetch from "../../helpers/safe_fetch";
import { setError } from "../../reducers/error";
import useAuth from "../../helpers/useAuth";
import store from "../../store";


function ContributorPopUp({
	selectedContributors,
	setSelectedContributors,
	title,
	max_contributors,
}: any) {
	const { loading, validauthtoken, isAdmin } = useAuth();
	const [matchedContributors, setMatchedContributors] = useState<any>([]);

	const load_contributors = async (fuzzy_name: string) => {
		if (fuzzy_name != "") {
			const rjson = await safe_fetch(
				window.BASE_URL + "/api/db/get_staff",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"auth-token": validauthtoken,
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
		await load_contributors(e.target.value);
	};

	const select_contributor = async (contributor_index: number) => {
		const selected: any = matchedContributors[contributor_index];

		const doesExist = selectedContributors.find(
			(selectedContributor: any) =>
				selectedContributor._id == selected._id
		);
		if (!doesExist) {
			// Short circuit if max contributors is a falsy value and set the contributor anyway
			// or, check if adding contributors is under the max
			if (
				!max_contributors ||
				selectedContributors.length < max_contributors
			) {
				setSelectedContributors([...selectedContributors, selected]);
			} else {
				// else, launch error pop up
				store.dispatch(
					setError(
						"There can only be a maximum of " +
						String(max_contributors) +
						" contributors"
					)
				);
			}
		}
	};

	const unselect_contributor = async (contributor_index: number) => {
		const selected: any = selectedContributors[contributor_index];

		const newselectedcontributors = selectedContributors.filter(
			(selectedContributor: any) =>
				selectedContributor._id != selected._id
		);

		setSelectedContributors(newselectedcontributors);
	};

	return (
		<div id="contributor_popup_container">
			<div>
				<h2>{title}</h2>
				<input type="text" onChange={on_type_contributor_handler} />
				<div>
					<h3>Matched Contributors: </h3>
					<div id="list_matched_contributors">
						{matchedContributors.map(
							(matchedContributor: any, index: number) => (
								<div key={matchedContributor._id}>
									<span>{matchedContributor.name}</span>
									&nbsp;&nbsp;|&nbsp;&nbsp;
									<span>{matchedContributor.email}</span>
									<button
										className="contributor_button"
										onClick={async () => {
											await select_contributor(index);
										}}
									>
										+
									</button>
								</div>
							)
						)}
					</div>
				</div>
				<div>
					<h3>Chosen Contributors:</h3>
					{selectedContributors.map(
						(selectedContributor: any, index: number) => (
							<div key={selectedContributor._id}>
								<span>{selectedContributor.name}</span>
								&nbsp;&nbsp;|&nbsp;&nbsp;
								<span>{selectedContributor.email}</span>
								<button
									className="contributor_button"
									onClick={async () => {
										await unselect_contributor(index);
									}}
								>
									-
								</button>
							</div>
						)
					)}
				</div>
			</div>
		</div>
	);
}

export default ContributorPopUp;
