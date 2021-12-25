// App.js
import * as React from "react";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import Login from "./routes/login/login";
import { Routes, Route, Link } from "react-router-dom";
import { useEffect } from "react";
import store from "./store";
import { setToken } from "./reducers/validAuthToken";
import { useAppSelector, useAppDispatch } from "./hooks";

interface ValidatorResponse {
	valid: boolean;
	isAdmin: boolean;
	uid: string;
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
					"http://127.0.0.1:5678/api/auth/verify/" + saved_auth_token,
					{
						method: "GET",
						headers: {},
					}
				);
				const rjson = (await r.json()) as ValidatorResponse;

				if (rjson.valid) {
					store.dispatch(setToken(saved_auth_token));
				}
			}
		})();
	});
	return (
		<div>
			<Navbar />
			<main>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="login" element={<Login />} />
				</Routes>
			</main>
		</div>
	);
}

function Home() {
	const validauthtoken = useAppSelector(
		(state) => state.validauthtoken.value
	);

	return (
		<main>
			<h1>Home</h1>
			<h2>Redux token: {validauthtoken}</h2>
		</main>
	);
}

export default App;
