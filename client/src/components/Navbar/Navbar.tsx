import "./Navbar.css";
import { Link } from "react-router-dom";
import useAuth from "../../helpers/useAuth";
import { useNavigate } from "react-router-dom";

function Navbar() {
	const navigate = useNavigate();
	const { validauthtoken, isApproved, logout } = useAuth();
	async function signOut() {
		localStorage.setItem("auth_token", "");
		logout()
		navigate("/")
	}

	return (
		<div>
			<nav>
				{validauthtoken ? (
					isApproved ? (
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
