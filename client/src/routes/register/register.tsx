import "./register.css";
import useAuth from "../../helpers/useAuth";
import { useNavigate } from "react-router-dom";

function Register() {
	const { register } = useAuth();
	const navigate = useNavigate()
	const register_handler: any = async (e: any) => {
		e.preventDefault();
		console.log(e);
		const email = e.target.elements["email"].value;
		const password = e.target.elements["password"].value;
		const name = e.target.elements["name"].value;

		await register(email, password, name);

		navigate("/")
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
