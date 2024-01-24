import "./create_staff.css";
import safe_fetch from "../../helpers/safe_fetch";
import Staff from "../../types/Staff";
import store from "../../store";
import useAuth from "../../helpers/useAuth";
import { useNavigate } from "react-router-dom";

interface CreateStaffResponse {
	message: string;
	staff: Staff;
}

function Create_Staff_Route() {
	const navigate = useNavigate();
	const { loading, validauthtoken, isApproved } = useAuth();

	const create_staff_handler: any = async (e: any) => {
		e.preventDefault();
		console.log(e);
		const name = e.target.elements["staff_name"].value;
		const email = e.target.elements["staff_email"].value;
		console.log("Creating a staff member", { name, email });
		const rjson = (await safe_fetch(
			window.BASE_URL + "/api/db/create_staff",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"auth-token": validauthtoken,
				},
				body: JSON.stringify({ name, email }),
			}
		)) as CreateStaffResponse;
		if (rjson?.staff?.slug) {
			navigate("/")
		}
	};

	return (
		<main id="create_staff_main">
			<h1>Create a staff member (aka a contributor)</h1>
			<form onSubmit={create_staff_handler} id="login_form">
				<input
					placeholder="John Doe"
					type="text"
					id="staff_name_form"
					name="staff_name"
				/>
				<br />
				<input
					placeholder="jdoe50@stuy.edu"
					type="email"
					id="staff_email_form"
					name="staff_email"
				/>
				<br />
				<input type="submit" id="staff_submit_btn" />
			</form>
		</main>
	);
}

export default Create_Staff_Route;
