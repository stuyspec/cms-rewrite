import React from "react";
import "./login.css";

const login_handler: any = async (e: any) => {
	e.preventDefault();
	console.log(e);
	const email = e.target.elements["email"].value;
	const password = e.target.elements["password"].value;
	console.log("Logging in", email, password);

	const r = await fetch("http://127.0.0.1:5678/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ email, password }),
	});

	const rjson = await r.json();

	console.log(rjson	);
};

function Login() {
	return (
		<div>
			<h1>Login</h1>
			<form onSubmit={login_handler} id="login_form">
				<input type="email" id="email_form" name="email" />
				<br />
				<input type="password" id="password_form" name="password" />
				<br />
				<input type="submit" id="submit_btn" />
			</form>
		</div>
	);
}

export default Login;
