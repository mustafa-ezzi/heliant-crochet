import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import Flower from "../components/Flower";
import { useBag } from "../lib/bag";
import { pageTitle } from "../lib/brand";
import { formatMoney } from "../lib/money";
import { usePageTitle } from "../lib/usePageTitle";

const API = "";

const NEXT = [
  "We read the note and start the piece.",
  "We write when it leaves the studio.",
  "It arrives in about 10–15 working days.",
];

function toOrder(row) {
  return {
    id: row.id,
    number: row.number,
    giftWrap: row.gift_wrap,
    giftWrapCents: row.gift_wrap_cents,
    subtotal: row.subtotal_cents / 100,
    note: row.note,
    lines: row.lines.map((line) => ({
      slug: line.slug,
      name: line.name,
      color: line.color,
      size: line.size,
      quantity: line.quantity,
      price: line.unit_price_cents / 100,
      image: line.image,
    })),
  };
}

export default function ConfirmationPage() {
  const [params] = useSearchParams();
  const orderId = params.get("order");
  const { state } = useLocation();
  const { clear } = useBag();
  const cleared = useRef(false);
  const [view, setView] = useState({ status: "loading", order: null });
  usePageTitle(pageTitle(view.order ? "It’s in our hands" : "Order"));

  useEffect(() => {
    if (!orderId) {
      setView({ status: "missing", order: null });
      return undefined;
    }
    let cancel = false;
    fetch(`${API}/api/v1/orders/${orderId}`)
      .then(async (response) => {
        if (cancel) return;
        if (response.status === 404) {
          setView({ status: "missing", order: null });
          return;
        }
        if (!response.ok) throw new Error("quiet");
        setView({ status: "ready", order: toOrder(await response.json()) });
      })
      .catch(() => {
        if (!cancel) setView({ status: "error", order: null });
      });
    return () => {
      cancel = true;
    };
  }, [orderId]);

  useEffect(() => {
    if (view.order && state?.placed && !cleared.current) {
      cleared.current = true;
      clear();
    }
  }, [view.order, state, clear]);

  if (view.status === "loading") {
    return (
      <main className="route-page">
        <div className="wrap">
          <p className="lede">One moment.</p>
        </div>
      </main>
    );
  }

  if (!view.order) {
    return (
      <main className="route-page">
        <div className="wrap">
          <article className="empty-card">
            <Flower className="doodle" />
            <h1>{view.status === "error" ? "The table is quiet for a moment." : "We can't find this order."}</h1>
            <Link className="btn" to="/contact">
              Write to the studio
            </Link>
          </article>
        </div>
      </main>
    );
  }

  const order = view.order;

  return (
    <main className="confirm-page">
      <div className="wrap narrow confirm-wrap">
        <p className="eyebrow">Sample order</p>
        <h1>It’s in our hands.</h1>
        <p className="order-sticker">{order.number}</p>
        <p className="sample-line">Sample only. No payment was taken.</p>

        <ol className="next-steps">
          {NEXT.map((text, index) => (
            <li key={text}>
              <span>{index + 1}</span>
              {text}
            </li>
          ))}
        </ol>

        <div className="bag-card">
          {order.lines.map((line) => (
            <article className="bag-line" key={`${line.slug}-${line.color}-${line.size}`}>
              <img src={line.image} alt="" />
              <div>
                <h2>{line.name}</h2>
                <p>
                  {line.color} · {line.size}
                </p>
                <p>Qty {line.quantity}</p>
              </div>
              <p className="bag-price">{formatMoney(line.price * line.quantity)}</p>
            </article>
          ))}
          {order.giftWrap ? (
            <p className="sum-row confirm-extra">
              <span>Gift wrap</span>
              <strong>{formatMoney(order.giftWrapCents / 100)}</strong>
            </p>
          ) : null}
          <p className="sum-row confirm-extra">
            <span>Subtotal</span>
            <strong>{formatMoney(order.subtotal)}</strong>
          </p>
          {order.note ? <p className="confirm-note">{order.note}</p> : null}
        </div>

        <Link className="btn" to="/shop">
          Shop the latest
        </Link>
      </div>
    </main>
  );
}
