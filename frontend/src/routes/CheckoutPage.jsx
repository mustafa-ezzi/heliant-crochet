import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { bagSubtotal, useBag } from "../lib/bag";
import { pageTitle } from "../lib/brand";
import { postJson } from "../lib/catalog";
import { formatMoney } from "../lib/money";
import { useStudioSettings } from "../lib/studio";
import { usePageTitle } from "../lib/usePageTitle";

const STEPS = ["Details", "Shipping", "Payment"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_DETAILS = { name: "", email: "", phone: "" };
const EMPTY_SHIPPING = { method: "ship", street: "", city: "", region: "", postal: "" };
const EMPTY_PAYMENT = { number: "", expiry: "", cvc: "", note: "" };

function digits(value) {
  return value.replace(/\D/g, "");
}

function expiryOk(value) {
  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value.trim());
  if (!match) return false;
  const month = Number(match[1]);
  const year = 2000 + Number(match[2]);
  const now = new Date();
  return year * 12 + (month - 1) >= now.getFullYear() * 12 + now.getMonth();
}

function detailErrors(fields) {
  const next = {};
  if (!fields.name.trim()) next.name = "Add the name for this order.";
  if (!fields.email.trim()) next.email = "Add an email so we can write about the order.";
  else if (!EMAIL.test(fields.email)) next.email = "That email does not look complete.";
  if (digits(fields.phone).length < 7) next.phone = "Add a phone number we can reach.";
  return next;
}

function shippingErrors(fields) {
  if (fields.method === "pickup") return {};
  const next = {};
  if (!fields.street.trim()) next.street = "Add a street so we know where to send it.";
  if (!fields.city.trim()) next.city = "Add a city.";
  if (!fields.region.trim()) next.region = "Add a state or region.";
  if (!fields.postal.trim()) next.postal = "Add a postal code.";
  return next;
}

function paymentErrors(fields) {
  const next = {};
  if (digits(fields.number).length !== 16) next.number = "Enter a 16-digit sample card number.";
  if (!expiryOk(fields.expiry)) next.expiry = "Use a month and year, like 11/28.";
  if (!/^\d{3,4}$/.test(fields.cvc.trim())) next.cvc = "Enter the 3 or 4 digit code.";
  return next;
}

export default function CheckoutPage() {
  const { lines, giftWrap } = useBag();
  const { giftWrap: giftWrapAmount } = useStudioSettings();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState(EMPTY_DETAILS);
  const [shipping, setShipping] = useState(EMPTY_SHIPPING);
  const [payment, setPayment] = useState(EMPTY_PAYMENT);
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [sendError, setSendError] = useState("");
  usePageTitle(pageTitle("Checkout"));

  useEffect(() => {
    if (lines.length === 0) navigate("/cart", { replace: true });
  }, [lines.length, navigate]);

  if (lines.length === 0) return null;

  function update(setter) {
    return (event) => {
      const { name, value } = event.target;
      setter((current) => ({ ...current, [name]: value }));
      setErrors((current) => ({ ...current, [name]: undefined }));
    };
  }

  function continueStep(event) {
    event.preventDefault();
    const next = step === 0 ? detailErrors(details) : shippingErrors(shipping);
    setErrors(next);
    if (Object.keys(next).length === 0) setStep((current) => current + 1);
  }

  async function placeOrder(event) {
    event.preventDefault();
    const detailsNext = detailErrors(details);
    const shippingNext = shippingErrors(shipping);
    const paymentNext = paymentErrors(payment);
    if (Object.keys(detailsNext).length) {
      setStep(0);
      setErrors(detailsNext);
      return;
    }
    if (Object.keys(shippingNext).length) {
      setStep(1);
      setErrors(shippingNext);
      return;
    }
    setErrors(paymentNext);
    if (Object.keys(paymentNext).length || placing) return;

    setPlacing(true);
    setSendError("");
    try {
      const saved = await postJson("/api/v1/orders", {
        name: details.name.trim(),
        email: details.email.trim(),
        phone: details.phone.trim(),
        method: shipping.method,
        street: shipping.street.trim(),
        city: shipping.city.trim(),
        region: shipping.region.trim(),
        postal: shipping.postal.trim(),
        note: payment.note.trim(),
        gift_wrap: giftWrap,
        lines: lines.map((line) => ({
          slug: line.slug,
          color: line.color,
          size: line.size,
          quantity: line.quantity,
        })),
      });
      navigate(`/checkout/confirmation?order=${saved.id}`, { state: { placed: true } });
    } catch {
      setSendError("The table is quiet for a moment. Please try again.");
      setPlacing(false);
    }
  }

  return (
    <main className="checkout-page">
      <header className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Checkout</p>
          <h1>Checkout</h1>
        </div>
      </header>
      <div className="wrap checkout-body">
        <ol className="step-pills">
          {STEPS.map((label, index) => (
            <li key={label}>
              <button
                type="button"
                className="step-pill"
                aria-current={step === index ? "step" : undefined}
                disabled={index > step}
                onClick={() => {
                  if (index < step) setStep(index);
                }}
              >
                {label}
              </button>
            </li>
          ))}
        </ol>

        <div className="cart-layout">
          <form className="paper-form" onSubmit={step === 2 ? placeOrder : continueStep} noValidate>
            {step === 0 ? (
              <>
                <Field label="Email" name="email" type="email" value={details.email} error={errors.email} onChange={update(setDetails)} />
                <Field label="Name" name="name" value={details.name} error={errors.name} onChange={update(setDetails)} />
                <Field label="Phone" name="phone" type="tel" value={details.phone} error={errors.phone} onChange={update(setDetails)} />
              </>
            ) : null}

            {step === 1 ? (
              <>
                <div className="choices" role="radiogroup" aria-label="Delivery">
                  <button
                    type="button"
                    className="choice"
                    role="radio"
                    aria-checked={shipping.method === "ship"}
                    onClick={() => setShipping((current) => ({ ...current, method: "ship" }))}
                  >
                    <strong>Ship it</strong>
                    <span>Handmade, so allow 10–15 working days.</span>
                  </button>
                  <button
                    type="button"
                    className="choice"
                    role="radio"
                    aria-checked={shipping.method === "pickup"}
                    onClick={() => {
                      setShipping((current) => ({ ...current, method: "pickup" }));
                      setErrors({});
                    }}
                  >
                    <strong>Local pickup</strong>
                    <span>We hold it at the studio.</span>
                  </button>
                </div>
                {shipping.method === "ship" ? (
                  <>
                    <Field label="Street" name="street" value={shipping.street} error={errors.street} onChange={update(setShipping)} />
                    <Field label="City" name="city" value={shipping.city} error={errors.city} onChange={update(setShipping)} />
                    <div className="split-fields">
                      <Field label="State" name="region" value={shipping.region} error={errors.region} onChange={update(setShipping)} />
                      <Field label="Postal code" name="postal" value={shipping.postal} error={errors.postal} onChange={update(setShipping)} />
                    </div>
                  </>
                ) : (
                  <p className="ship-note">Pickup is at the studio. We’ll write when the piece is ready.</p>
                )}
              </>
            ) : null}

            {step === 2 ? (
              <>
                <p className="sample-note">Sample payment. Nothing is charged.</p>
                <Field label="Card number" name="number" inputMode="numeric" value={payment.number} error={errors.number} onChange={update(setPayment)} />
                <div className="split-fields">
                  <Field label="Expiry" name="expiry" value={payment.expiry} error={errors.expiry} onChange={update(setPayment)} hint="11/28" />
                  <Field label="Security code" name="cvc" inputMode="numeric" value={payment.cvc} error={errors.cvc} onChange={update(setPayment)} />
                </div>
                <Field
                  label="Order note"
                  name="note"
                  value={payment.note}
                  onChange={update(setPayment)}
                  hint="Anything we should know about the color?"
                  multiline
                />
                <p className="trust">
                  Made to order. Delivery takes 10–15 working days. By placing an order, you agree to our{" "}
                  <Link to="/policies">policies</Link>. This sample checkout does not charge a card.
                </p>
                <div className="pay-marks" aria-hidden="true">
                  <span>Visa</span>
                  <span>Mastercard</span>
                  <span>Amex</span>
                </div>
              </>
            ) : null}

            {sendError ? <p className="error">{sendError}</p> : null}
            <div className="checkout-actions">
              {step > 0 ? (
                <button type="button" className="btn btn-paper" onClick={() => setStep((current) => current - 1)}>
                  Back
                </button>
              ) : (
                <Link className="btn btn-paper" to="/cart">
                  Back to bag
                </Link>
              )}
              <button type="submit" className="btn" disabled={placing}>
                {step === 2 ? "Place the order" : "Continue"}
              </button>
            </div>
          </form>

          <aside className="summary-card">
            <h2>Your pieces</h2>
            <ul className="summary-lines">
              {lines.map((line) => (
                <li key={line.key}>
                  <img src={line.image} alt="" />
                  <div>
                    <strong>{line.name}</strong>
                    <span>
                      {line.color} · {line.size}
                    </span>
                    <span>Qty {line.quantity}</span>
                  </div>
                  <b>{formatMoney(line.price * line.quantity)}</b>
                </li>
              ))}
            </ul>
            {giftWrap ? (
              <p className="sum-row">
                <span>Gift wrap</span>
                <strong>{formatMoney(giftWrapAmount)}</strong>
              </p>
            ) : null}
            <p className="sum-row">
              <span>Subtotal</span>
              <strong>{formatMoney(bagSubtotal(lines, giftWrap, giftWrapAmount))}</strong>
            </p>
            <p className="ship-note">Shipping is calculated at checkout</p>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Field({ label, name, value, onChange, error, type = "text", multiline = false, hint, inputMode }) {
  const id = `checkout-${name}`;
  return (
    <div className={error ? "field is-error" : "field"}>
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea id={id} name={name} value={value} onChange={onChange} />
      ) : (
        <input id={id} name={name} type={type} inputMode={inputMode} value={value} onChange={onChange} />
      )}
      {hint ? <p className="hint">{hint}</p> : null}
      {error ? <p className="error">{error}</p> : null}
    </div>
  );
}
