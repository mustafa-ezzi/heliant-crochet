import { useState } from "react";
import { Link } from "react-router-dom";
import { useAccount } from "../lib/account";
import { pageTitle } from "../lib/brand";
import { formatMoney } from "../lib/money";
import { usePageTitle } from "../lib/usePageTitle";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const STATUS = {
  pending: "Pending",
  stitching: "Stitching",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function AccountPage() {
  const { status, user, orders, signIn, register, signOut } = useAccount();
  const [creating, setCreating] = useState(false);
  const [fields, setFields] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  usePageTitle(pageTitle("Account"));

  function update(event) {
    const { name, value } = event.target;
    setFields((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined, detail: undefined }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    const next = {};
    if (creating && !fields.name.trim()) next.name = "Add your name so the studio knows who you are.";
    if (!fields.email.trim()) next.email = "Add the email for this account.";
    else if (!EMAIL.test(fields.email)) next.email = "That email does not look complete.";
    if (!fields.password) next.password = "Add a password.";
    else if (creating && fields.password.length < 8) next.password = "Use at least 8 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;
    try {
      if (creating) await register(fields);
      else await signIn({ email: fields.email, password: fields.password });
    } catch (error) {
      setErrors(error.payload || { detail: "The table is quiet for a moment. Please try again." });
    }
  }

  if (status === "loading") {
    return (
      <main className="route-page">
        <div className="wrap">
          <p className="lede">One moment.</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main>
        <header className="page-hero">
          <div className="wrap">
            <p className="eyebrow">Account</p>
            <h1>{creating ? "Create an account" : "Come in"}</h1>
          </div>
        </header>
        <section className="form-section">
          <div className="wrap">
            <form className="paper-form account-card" onSubmit={onSubmit} noValidate>
              {creating ? (
                <Field label="Name" name="name" value={fields.name} error={errors.name} onChange={update} />
              ) : null}
              <Field label="Email" name="email" type="email" value={fields.email} error={errors.email} onChange={update} />
              <Field label="Password" name="password" type="password" value={fields.password} error={errors.password} onChange={update} />
              {errors.detail ? <p className="error">{errors.detail}</p> : null}
              <button className="btn" type="submit">
                {creating ? "Create an account" : "Come in"}
              </button>
              <button
                className="account-switch"
                type="button"
                onClick={() => {
                  setCreating((value) => !value);
                  setErrors({});
                }}
              >
                {creating ? "Already have an account? Come in" : "Create an account"}
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="account-page">
      <header className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Account</p>
          <h1>{user.name}</h1>
          <p className="lede">{user.email}</p>
        </div>
      </header>
      <section className="form-section">
        <div className="wrap account-orders">
          {orders.length === 0 ? (
            <article className="empty-card shop-empty">
              <h2>No orders on your table yet.</h2>
              <Link className="btn" to="/shop">
                Shop the latest
              </Link>
            </article>
          ) : (
            orders.map((order) => (
              <article className="order-block" key={order.id}>
                <div className="order-head">
                  <h2>{order.number}</h2>
                  <span className={`status-sticker status-${order.status}`}>{STATUS[order.status] || order.status}</span>
                </div>
                <ul className="order-pieces">
                  {order.lines.map((line) => (
                    <li key={`${line.slug}-${line.color}-${line.size}`}>
                      {line.name} · {line.color} · {line.size} · Qty {line.quantity}
                    </li>
                  ))}
                </ul>
                <p className="sum-row">
                  <span>Total</span>
                  <strong>{formatMoney(order.subtotal_cents / 100)}</strong>
                </p>
              </article>
            ))
          )}
          <button className="btn btn-paper" type="button" onClick={signOut}>
            Sign out
          </button>
        </div>
      </section>
    </main>
  );
}

function Field({ label, name, type = "text", value, error, onChange }) {
  const id = `account-${name}`;
  return (
    <div className={error ? "field is-error" : "field"}>
      <label htmlFor={id}>{label}</label>
      <input id={id} name={name} type={type} value={value} onChange={onChange} />
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}
