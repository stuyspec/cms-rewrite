import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

import { useAppSelector } from "../../hooks";
import store from "../../store";
import { setToken } from "../../reducers/validAuthToken";

async function signOut() {
	store.dispatch(setToken(""));
	localStorage.setItem("auth_token", "");
	window.location.replace("/");
}

function Navbar() {
	const validauthtoken = useAppSelector(
		(state) => state.validauthtoken.value
	);
	const isapproved = useAppSelector((state) => state.isApproved.value);

	return (
		<div>
			<nav>
				{validauthtoken ? (
					isapproved ? (
						<Link to="/drafts">Drafts</Link>
					) : (
						<></>
					)
				) : (
					<Link to="/login">Login</Link>
				)}

				<Link to="/">Spectator CMS</Link>

				{validauthtoken ? (
					<span onClick={signOut}>Sign out</span>
				) : (
					<Link to="/register">Register</Link>
				)}
			</nav>
		</div>
	);
}

export default Navbar;
