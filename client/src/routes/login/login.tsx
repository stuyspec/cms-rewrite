import React from "react";
import "./login.css";
import safe_fetch from "../../helpers/safe_fetch";
interface LoginResponse {
	token: string;
	logged_in: boolean;
	uid: string;
	is_admin: boolean;
}

function Login() {
	const login_handler: any = async (e: any) => {
		e.preventDefault();
		console.log(e);
		const email = e.target.elements["email"].value;
		const password = e.target.elements["password"].value;
		console.log("Logging in", email, password);

		const rjson = await safe_fetch(window.BASE_URL + "/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email, password }),
		}) as LoginResponse;

		if (rjson.logged_in) {
			localStorage.setItem("auth_token", rjson.token);
			window.location.replace("/"); // dispatching done by /verify anyway
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
