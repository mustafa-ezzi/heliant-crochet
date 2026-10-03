import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BrandLockup from "../../components/BrandLockup";
import { adminRequest } from "../../lib/admin";
import { pageTitle } from "../../lib/brand";
import { usePageTitle } from "../../lib/usePageTitle";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [fields, setFields] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  usePageTitle(pageTitle("Studio"));

  useEffect(() => {
    adminRequest("/api/v1/admin/session")
      .then(() => navigate("/admin", { replace: true }))
      .catch(() => setReady(true));
  }, [navigate]);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await adminRequest("/api/v1/admin/login", { method: "POST", body: fields });
      navigate("/admin");
    } catch (err) {
      setError(err.payload?.detail || "That email and password do not open the studio.");
    }
  }

  if (!ready) return <p className="admin-wait">One moment.</p>;

  return (
    <main className="admin-login">
      <BrandLockup />
      <form className="paper-form" onSubmit={onSubmit}>
        <p className="eyebrow">Studio</p>
        <h1>Come in</h1>
        <div className="field">
          <label htmlFor="owner-email">Email</label>
          <input
            id="owner-email"
            type="email"
            value={fields.email}
            onChange={(event) => setFields({ ...fields, email: event.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="owner-password">Password</label>
          <input
            id="owner-password"
            type="password"
            value={fields.password}
            onChange={(event) => setFields({ ...fields, password: event.target.value })}
          />
        </div>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn" type="submit">
          Come in
        </button>
      </form>
    </main>
  );
}
