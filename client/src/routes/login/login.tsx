import React from "react";
import "./login.css";

import { useAppSelector, useAppDispatch } from "../../hooks";

import { setToken } from "../../reducers/validAuthToken";

interface LoginResponse {
	token: string;
	logged_in: boolean;
	uid: string;
}

function Login() {
	const dispatch = useAppDispatch();

	const login_handler: any = async (e: any) => {
		e.preventDefault();
		console.log(e);
		const email = e.target.elements["email"].value;
		const password = e.target.elements["password"].value;
		console.log("Logging in", email, password);

		const r = await fetch(window.BASE_URL + "/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		});

		const rjson = (await r.json()) as LoginResponse;

		if (rjson.logged_in) {
			dispatch(setToken(rjson.token));
			localStorage.setItem("auth_token", rjson.token);
			window.location.replace("/");
		}
	};

	return (
		<div>
			<h1>Login</h1>
			<form onSubmit={login_handler} id="login_form">
				<input
					placeholder="Email"
					type="email"
					id="email_form"
					name="email"
				/>
				<br />
				<input
					placeholder="Password"
					type="password"
					id="password_form"
					name="password"
				/>
				<br />
				<input type="submit" id="submit_btn" />
			</form>
		</div>
	);
}

export default Login;
