import { useState } from "react";
import { Spark } from "../components/Doodles";
import { Link } from "react-router-dom";
import { pageTitle } from "../lib/brand";
import { postJson } from "../lib/catalog";
import { usePageTitle } from "../lib/usePageTitle";

const EMPTY = { name: "", email: "", topic: "hello", message: "" };

export default function ContactPage() {
  const [fields, setFields] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");
  usePageTitle(pageTitle("Contact"));

  function update(event) {
    const { name, value } = event.target;
    setFields((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    const next = {};
    if (!fields.name.trim()) next.name = "Add your name so we know who to write.";
    if (!fields.email.trim()) next.email = "Add an email so we can write back.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      next.email = "That email does not look complete.";
    }
    if (!fields.message.trim()) next.message = "Add a note so we know how to help.";
    setErrors(next);
    setSendError("");
    if (Object.keys(next).length) return;
    try {
      await postJson("/api/v1/contact", fields);
      setSent(true);
    } catch {
      setSendError("The table is quiet for a moment. Please try again.");
    }
  }

  return (
    <main>
      <header className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Hello</p>
          <h1>
            Contact <Spark />
          </h1>
          <p className="lede">
            A note to the studio. <span className="hand-bit">We read every one.</span>
          </p>
        </div>
      </header>

      <section className="contact-section">
        <div className="wrap contact-grid">
          <div className="contact-aside">
            <p>Write when you are choosing a gift, checking an order, or just saying hello.</p>
            <article className="stitched mini">
              <h2>Email</h2>
              <p>hello@helianthook.studio</p>
            </article>
            <article className="stitched mini">
              <h2>Studio hours</h2>
              <p>Weekday mornings. We write back within two days.</p>
            </article>
            <article className="stitched mini">
              <h2>Custom orders</h2>
              <p>A piece made for your corner.</p>
              <Link className="text-link" to="/custom">
                Start a custom order
              </Link>
            </article>
          </div>

          {sent ? (
            <article className="success-card">
              <h2>Got it.</h2>
              <p>We’ll write back within two days.</p>
            </article>
          ) : (
            <form className="paper-form" onSubmit={onSubmit} noValidate>
              <div className={errors.name ? "field is-error" : "field"}>
                <label htmlFor="contact-name">Name</label>
                <input id="contact-name" name="name" value={fields.name} onChange={update} />
                {errors.name ? <p className="error">{errors.name}</p> : null}
              </div>
              <div className={errors.email ? "field is-error" : "field"}>
                <label htmlFor="contact-email">Email</label>
                <input id="contact-email" name="email" type="email" value={fields.email} onChange={update} />
                {errors.email ? <p className="error">{errors.email}</p> : null}
              </div>
              <div className="field">
                <label htmlFor="contact-topic">Topic</label>
                <select id="contact-topic" name="topic" value={fields.topic} onChange={update}>
                  <option value="order">Order</option>
                  <option value="custom">Custom</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="hello">Hello</option>
                </select>
              </div>
              <div className={errors.message ? "field is-error" : "field"}>
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" name="message" value={fields.message} onChange={update} />
                {errors.message ? <p className="error">{errors.message}</p> : null}
              </div>
              {sendError ? <p className="error">{sendError}</p> : null}
              <button className="btn" type="submit">
                Send the note
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
