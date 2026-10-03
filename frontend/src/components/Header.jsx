import { useEffect, useState } from "react";
import { Menu, ShoppingBag, UserRound, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAccount } from "../lib/account";
import { useBag } from "../lib/bag";
import BrandLockup from "./BrandLockup";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { count } = useBag();
  const { user } = useAccount();
  const pieces = `${count} ${count === 1 ? "piece" : "pieces"}`;

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(event) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="header-sticky">
      <header className="header">
        <div className={user ? "header-inner is-signed-in" : "header-inner"}>
          <BrandLockup />
          <nav className="nav" aria-label="Shop">
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <NavLink
              to="/account"
              className={user ? "account-chip" : "icon-btn account-link"}
              aria-label={user ? `${user.name}, account` : "Account"}
            >
              <UserRound size={20} strokeWidth={2} />
              {user ? <span className="account-name">{user.name}</span> : null}
            </NavLink>
            <NavLink to="/cart" className="icon-btn" aria-label={`Bag, ${pieces}`}>
              <ShoppingBag size={20} strokeWidth={2} />
              <span className="cart-count">{count}</span>
            </NavLink>
            <button
              type="button"
              className="icon-btn menu-btn"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </header>
      {open ? (
        <div className="mobile-sheet" id="mobile-nav">
          <nav className="mobile-nav" aria-label="Shop">
            {LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.end}>
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
