import React from "react";
import "./register.css";

import { useAppSelector, useAppDispatch } from "../../hooks";

import { setToken } from "../../reducers/validAuthToken";

interface RegisterResponse {
	token: string;
	logged_in: boolean;
	uid: string;
}

function Register() {
	const dispatch = useAppDispatch();

	const register_handler: any = async (e: any) => {
		e.preventDefault();
		console.log(e);
		const email = e.target.elements["email"].value;
		const password = e.target.elements["password"].value;
		const name = e.target.elements["name"].value;

		const r = await fetch(window.BASE_URL + "/api/auth/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password, name }),
		});

		const rjson = (await r.json()) as RegisterResponse;

		if (rjson.logged_in) {
			dispatch(setToken(rjson.token));
			localStorage.setItem("auth_token", rjson.token);
			window.location.replace("/");
		}
	};

	return (
		<div>
			<h1>Register</h1>
			<form onSubmit={register_handler} id="register_form">
				<input
					placeholder="Full name"
					type="text"
					id="name_form"
					name="name"
				/>
				<br />
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

export default Register;
