import { createContext, useContext, useEffect, useState } from "react";
import { postJson } from "./catalog";

const API = "";
const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const [state, setState] = useState({ status: "loading", user: null, orders: [] });

  async function refresh() {
    const response = await fetch(`${API}/api/v1/account`, { credentials: "include" });
    if (!response.ok) {
      setState({ status: "ready", user: null, orders: [] });
      return;
    }
    const data = await response.json();
    setState({ status: "ready", user: data.user, orders: data.orders || [] });
  }

  useEffect(() => {
    refresh();
  }, []);

  async function signIn(body) {
    const data = await postJson("/api/v1/account/login", body);
    setState({ status: "ready", user: data.user, orders: data.orders || [] });
  }

  async function register(body) {
    const data = await postJson("/api/v1/account/register", body);
    setState({ status: "ready", user: data.user, orders: data.orders || [] });
  }

  async function signOut() {
    await postJson("/api/v1/account/logout", {});
    setState({ status: "ready", user: null, orders: [] });
  }

  return (
    <AccountContext.Provider value={{ ...state, signIn, register, signOut, refresh }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const account = useContext(AccountContext);
  if (!account) throw new Error("useAccount must be used inside AccountProvider");
  return account;
}
