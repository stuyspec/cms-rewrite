import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import safe_fetch from "./safe_fetch";
import store from "../store";
import { setToken } from "../reducers/validAuthToken";
import { setIsAdmin } from "../reducers/isAdmin";
import { setIsApproved } from "../reducers/isApproved";
import { setuid } from "../reducers/uid";

interface IAuthContext {
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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
          store.dispatch(setToken(saved_auth_token));
          store.dispatch(setIsAdmin(rjson.isAdmin));
          store.dispatch(setIsApproved(rjson.isApproved));
          store.dispatch(setuid(rjson.uid));
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
          store.dispatch(setToken(rjson.token));
          store.dispatch(setIsAdmin(rjson.is_admin));
          store.dispatch(setIsApproved(rjson.isApproved));
          store.dispatch(setuid(rjson.uid));
          res()
        }
      });
    },
    logout() {
      return new Promise<void>((res) => {
        setToken("");
        res();
      });
    },
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export default function AuthConsumer() {
  return useContext(authContext);
}