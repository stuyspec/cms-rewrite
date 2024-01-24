import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import safe_fetch from "./safe_fetch";

interface IAuthContext {
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (email: string, password: string, name: string) => Promise<void>;
	logout: () => Promise<void>;
	validauthtoken: string;
	setValidAuthToken: React.Dispatch<React.SetStateAction<string>>;
	isAdmin: boolean;
	setIsAdmin: React.Dispatch<React.SetStateAction<boolean>>;
	isApproved: boolean;
	setIsApproved: React.Dispatch<React.SetStateAction<boolean>>;
	uid: string;
	setUid: React.Dispatch<React.SetStateAction<string>>;
}

interface RegisterResponse {
	token: string;
	logged_in: boolean;
	uid: string;
}

const authContext = createContext<IAuthContext>(null!);

interface LoginResponse {
	token: string;
	logged_in: boolean;
	uid: string;
	is_admin: boolean;
	isApproved: boolean;
}

interface ValidatorResponse {
	valid: boolean;
	isAdmin: boolean;
	isApproved: boolean;
	uid: string;
}


function useAuth() {
	const [loading, setLoading] = useState<boolean>(true);
	const [validauthtoken, setValidAuthToken] = useState<string>("");
	const [isAdmin, setIsAdmin] = useState<boolean>(false);
	const [isApproved, setIsApproved] = useState<boolean>(false);
	const [uid, setUid] = useState<string>("");

	useEffect(() => {
		// Using an IIFE
		const load = async () => {
			const saved_auth_token = localStorage.getItem("auth_token");

			if (saved_auth_token) {
				// console.log("Saved auth token: ", saved_auth_token);
				const rjson = (await safe_fetch(
					window.BASE_URL + "/api/auth/verify/" + saved_auth_token,
					{
						method: "GET",
						headers: {},
					}
				)) as ValidatorResponse;

				if (rjson.valid) {
					console.log("Verified user: ", rjson);
					setValidAuthToken(saved_auth_token);
					setIsAdmin(rjson.isAdmin);
					setIsApproved(rjson.isApproved);
					setUid(rjson.uid)
				}
			}

			setLoading(false);
		};

		load()
	});


	return {
		loading,
		login(email: string, password: string) {
			return new Promise<void>(async (res) => {
				console.log("Logging in", email, password);

				const rjson = (await safe_fetch(window.BASE_URL + "/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				})) as LoginResponse;

				if (rjson.logged_in) {
					localStorage.setItem("auth_token", rjson.token);
					setValidAuthToken(rjson.token);
					setIsAdmin(rjson.is_admin);
					setIsApproved(rjson.isApproved);
					setUid(rjson.uid)
					res()
				}
			});
		},
		logout() {
			return new Promise<void>((res) => {
				setValidAuthToken("");
				setIsAdmin(false);
				setIsApproved(false);
				setUid("")
				res();
			});
		},
		register(email: string, password: string, name: string) {
			return new Promise<void>(async (res) => {
				const rjson = (await safe_fetch(
					window.BASE_URL + "/api/auth/register",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ email, password, name }),
					}
				)) as RegisterResponse;

				if (rjson.logged_in) {
					setValidAuthToken(rjson.token);
					localStorage.setItem("auth_token", rjson.token);
					setIsAdmin(false);
					setIsApproved(false);
					setUid(rjson.uid)
					res()
				}
			});
		},
		validauthtoken,
		setValidAuthToken,
		isAdmin,
		setIsAdmin,
		isApproved,
		setIsApproved,
		uid,
		setUid
	};
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const auth = useAuth();

	return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function AuthConsumer() {
	return useContext(authContext);
}