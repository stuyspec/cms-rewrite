// App.js
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import Drafts from "./routes/drafts/drafts";
import Draft_id from "./routes/draft_id/draft_id";
import Create_draft from "./routes/create_draft/create_draft";
import Parse_draft from "./routes/parse_draft/parse_draft";
import Create_Staff_Route from "./routes/create_staff/create_staff";
import Access_Denied from "./routes/403/403";
import Not_Found from "./routes/404/404";
import { Routes, Route, Link } from "react-router-dom";
import { useEffect } from "react";
import store from "./store";
import { setToken } from "./reducers/validAuthToken";
import { setIsAdmin } from "./reducers/isAdmin";
import { setIsApproved } from "./reducers/isApproved";
import { setuid } from "./reducers/uid";
import { useAppSelector } from "./hooks";
import ErrorModal from "./components/ErrorModal/ErrorModal";
import { setError } from "./reducers/error";
import safe_fetch from "./helpers/safe_fetch";

interface ValidatorResponse {
	valid: boolean;
	isAdmin: boolean;
	isApproved: boolean;
	uid: string;
}

declare global {
	interface Window {
		BASE_URL: string;
	}
}

function App() {
	useEffect(() => {
		// Using an IIFE
		(async () => {
			console.log("Loaded");
			const saved_auth_token = localStorage.getItem("auth_token");

			if (saved_auth_token) {
				console.log("Saved auth token: ", saved_auth_token);
				const rjson = (await safe_fetch(
					window.BASE_URL + "/api/auth/verify/" + saved_auth_token,
					{
						method: "GET",
						headers: {},
					}
				)) as ValidatorResponse;

				if (rjson.valid) {
					console.log(rjson);
					store.dispatch(setToken(saved_auth_token));
					store.dispatch(setIsAdmin(rjson.isAdmin));
					store.dispatch(setIsApproved(rjson.isApproved));
					store.dispatch(setuid(rjson.uid));
				}
			}
		})();
	});

	if (!import.meta.env.MODE || import.meta.env.MODE === "development") {
		console.log("Dev");
		window.BASE_URL = "http://127.0.0.1:5678";
	} else {
		console.log("Production");
		window.BASE_URL = "https://cms-alpha-backend.stuyspec.com";
	}

	return (
		<div>
			<Navbar />
			<main>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="login" element={<Login />} />
					<Route path="register" element={<Register />} />
					<Route path="drafts" element={<Drafts />} />
					<Route path="draft/:slug" element={<Draft_id />} />
					<Route path="create_draft" element={<Create_draft />} />
					<Route path="parse_draft" element={<Parse_draft />} />
					<Route
						path="create_staff"
						element={<Create_Staff_Route />}
					/>
					<Route path="403" element={<Access_Denied />} />
					<Route path="*" element={<Not_Found />} />
				</Routes>
			</main>
			<ErrorModal />
		</div>
	);
}

function Home() {
	const validauthtoken = useAppSelector(
		(state) => state.validauthtoken.value
	);
	const isAdmin = useAppSelector((state) => state.isAdmin.value);
	const isApproved = useAppSelector((state) => state.isApproved.value);
	const uid = useAppSelector((state) => state.uid.value);

	const approveUser = async (e: any) => {
		e.preventDefault();
		if (isAdmin) {
			const uid_submission = e.target.elements["uid"].value;
			const rjson = (await safe_fetch(
				window.BASE_URL + "/api/auth/approve_user",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"auth-token": store.getState().validauthtoken.value,
					},
					body: JSON.stringify({ uid: uid_submission }),
				}
			)) as { success: boolean };
			if (rjson.success) {
				e.target.reset();
			}
		} else {
			store.dispatch(setError("Non-admins cannot approve users!"));
		}
	};
	return (
		<main id="home_main">
			<h1>Home</h1>
			<h3>UID: {uid}</h3>
			{validauthtoken ? (
				<div>
					{!isApproved ? (
						<h1>
							YOU NEED TO REQUEST ACCOUNT VERIFICATION FROM A STUY
							SPEC ADMIN
						</h1>
					) : (
						<></>
					)}
					<p>Logged in!</p>
					<p>Is admin: {String(isAdmin)}</p>
					{isAdmin ? (
						<div>
							<h3>Approve a user:</h3>
							<form onSubmit={approveUser}>
								<input
									type="text"
									name="uid"
									placeholder="UID"
								/>
								<br />
								<input type="submit" />
							</form>
							<h3 id="create_staff_link">
								<Link to="/create_staff">
									Create a contributor
								</Link>
							</h3>
						</div>
					) : (
						<></>
					)}

					{isApproved ? (
						<div id="create_draft_div">
							<h1>
								<Link to="/create_draft">Create a draft</Link>
							</h1>
							<h1>
								<Link to="/parse_draft">Parse a draft</Link>
							</h1>
						</div>
					) : (
						<></>
					)}
				</div>
			) : (
				<div>
					<p>Not logged in. Please log in.</p>
				</div>
			)}
		</main>
	);
}

export default App;
