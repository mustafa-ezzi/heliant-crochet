import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Scribble } from "../components/Doodles";
import StepGrid from "../components/StepGrid";
import { pageTitle } from "../lib/brand";
import { postJson } from "../lib/catalog";
import { titleFromSlug } from "../lib/titleFromSlug";
import { usePageTitle } from "../lib/usePageTitle";

const EMPTY = {
  name: "",
  email: "",
  want: "",
  colors: "",
  size: "",
  timing: "",
  photo: "",
};

export default function CustomPage() {
  const [params] = useSearchParams();
  const piece = params.get("piece");
  const [fields, setFields] = useState({
    ...EMPTY,
    want: piece ? titleFromSlug(piece) : "",
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");
  usePageTitle(pageTitle("Custom orders"));

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
    if (!fields.want.trim()) next.want = "Tell us what you would like made.";
    setErrors(next);
    setSendError("");
    if (Object.keys(next).length) return;
    try {
      await postJson("/api/v1/custom-requests", fields);
      setSent(true);
    } catch {
      setSendError("The table is quiet for a moment. Please try again.");
    }
  }

  return (
    <main>
      <header className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Custom, without the fuss</p>
          <h1>
            Made for your <Scribble>corner</Scribble>
          </h1>
          <p className="lede">Tell us the colors, the size, and the little details that matter.</p>
        </div>
      </header>

      <section className="steps">
        <div className="wrap">
          <StepGrid />
        </div>
      </section>

      <section className="form-section">
        <div className="wrap narrow">
          {sent ? (
            <article className="success-card">
              <h2>Got it.</h2>
              <p>We’ll write back within two days.</p>
            </article>
          ) : (
            <form className="paper-form" onSubmit={onSubmit} noValidate>
              <Field label="Name" name="name" value={fields.name} error={errors.name} onChange={update} />
              <Field label="Email" name="email" type="email" value={fields.email} error={errors.email} onChange={update} />
              <Field label="What you want" name="want" value={fields.want} error={errors.want} onChange={update} multiline />
              <Field label="Colors" name="colors" value={fields.colors} onChange={update} />
              <Field label="Size or measurements" name="size" value={fields.size} onChange={update} />
              <Field label="Timing" name="timing" value={fields.timing} onChange={update} hint="A week you are hoping for is enough." />
              <Field
                label="Photo note"
                name="photo"
                value={fields.photo}
                onChange={update}
                multiline
                hint="Describe a photo or a piece you love. No upload needed yet."
              />
              {sendError ? <p className="error">{sendError}</p> : null}
              <button className="btn" type="submit">
                Send the request
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

function Field({ label, name, value, onChange, error, type = "text", multiline = false, hint }) {
  const id = `custom-${name}`;
  return (
    <div className={error ? "field is-error" : "field"}>
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea id={id} name={name} value={value} onChange={onChange} />
      ) : (
        <input id={id} name={name} type={type} value={value} onChange={onChange} />
      )}
      {hint ? <p className="hint">{hint}</p> : null}
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}
