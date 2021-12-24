import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
function Login() {
	return (
		<div className="App">
			<nav>
				<Link to="/login">Login</Link>
				<Link to="/">Spectator CMS</Link>
				<Link to="/register">Register</Link>
			</nav>
		</div>
	);
}

export default Login;
