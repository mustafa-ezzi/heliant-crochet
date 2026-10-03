import { useEffect, useState } from "react";
import { Navigate, NavLink, Outlet, useLocation, useSearchParams } from "react-router-dom";
import BrandLockup from "../../components/BrandLockup";
import { adminRequest } from "../../lib/admin";
import { pageTitle } from "../../lib/brand";
import { postJson } from "../../lib/catalog";
import { usePageTitle } from "../../lib/usePageTitle";

const LINKS = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/reports", label: "Reports" },
];

function titleFor(pathname) {
  if (pathname.startsWith("/admin/products/new")) return "New piece";
  if (/^\/admin\/products\/\d+/.test(pathname)) return "Edit piece";
  if (pathname.startsWith("/admin/products")) return "Products";
  if (/^\/admin\/orders\/\d+/.test(pathname)) return "Order";
  if (pathname.startsWith("/admin/orders")) return "Orders";
  if (pathname.startsWith("/admin/customers")) return "Customers";
  if (pathname.startsWith("/admin/reports")) return "Orders report";
  return "Dashboard";
}

export default function AdminLayout() {
  const location = useLocation();
  const [params, setParams] = useSearchParams();
  const [owner, setOwner] = useState(undefined);
  const title = titleFor(location.pathname);
  const query = params.get("q") || "";
  usePageTitle(pageTitle(title));

  useEffect(() => {
    adminRequest("/api/v1/admin/session")
      .then(setOwner)
      .catch(() => setOwner(null));
  }, []);

  function onSearch(event) {
    const next = new URLSearchParams(params);
    const value = event.target.value;
    if (value) next.set("q", value);
    else next.delete("q");
    setParams(next, { replace: true });
  }

  async function signOut() {
    await postJson("/api/v1/account/logout", {});
    setOwner(null);
  }

  if (owner === undefined) {
    return <p className="admin-wait">One moment.</p>;
  }
  if (!owner) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin">
      <aside className="rail">
        <BrandLockup onInk />
        <nav aria-label="Studio">
          {LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button className="rail-out" type="button" onClick={signOut}>
          Sign out
        </button>
      </aside>
      <div className="admin-main">
        <header className="admin-top">
          <h1>{title}</h1>
          <input className="admin-search" value={query} onChange={onSearch} placeholder="Search the desk" aria-label="Search the desk" />
          <p>{owner.name}</p>
        </header>
        <Outlet context={{ query }} />
      </div>
    </div>
  );
}
