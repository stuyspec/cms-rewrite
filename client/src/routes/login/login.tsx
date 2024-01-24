import { useLocation, useNavigate } from "react-router-dom";
import "./login.css";
import useAuth from "../../helpers/useAuth";


function Login() {
	const navigate = useNavigate();
	const { login } = useAuth();
	const { state } = useLocation();


	const login_handler: any = async (e: any) => {
		e.preventDefault();
		console.log(e);
		const email = e.target.elements["email"].value;
		const password = e.target.elements["password"].value;
		await login(email, password);
		navigate(state?.path || "/")
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
