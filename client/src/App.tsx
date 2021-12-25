// App.js
import * as React from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import Drafts from "./routes/drafts/drafts";
import Draft_id from "./routes/draft_id/draft_id";
import { Routes, Route, Link } from "react-router-dom";
import { useEffect } from "react";
import store from "./store";
import { setToken } from "./reducers/validAuthToken";
import { setIsAdmin } from "./reducers/isAdmin";
import { useAppSelector, useAppDispatch } from "./hooks";

interface ValidatorResponse {
	valid: boolean;
	isAdmin: boolean;
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
				const r = await fetch(
					window.BASE_URL + "/api/auth/verify/" + saved_auth_token,
					{
						method: "GET",
						headers: {},
					}
				);
				const rjson = (await r.json()) as ValidatorResponse;

				if (rjson.valid) {
					console.log(rjson);
					store.dispatch(setToken(saved_auth_token));
					store.dispatch(setIsAdmin(rjson.isAdmin));
				}
			}
		})();
	});

	if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
		console.log("Dev");
		window.BASE_URL = "http://127.0.0.1:5678";
	} else {
		console.log("Production");
		window.BASE_URL = "https://stuyspeccmsbackend.herokuapp.com";
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
				</Routes>
			</main>
		</div>
	);
}

function Home() {
	const validauthtoken = useAppSelector(
		(state) => state.validauthtoken.value
	);
	const isAdmin = useAppSelector((state) => state.isAdmin.value);

	return (
		<main id="home_main">
			<h1>Home</h1>
			{validauthtoken ? (
				<div>
					<p>Logged in!</p>
					<p>Is admin: {String(isAdmin)}</p>
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
