import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { adminRequest, money, shortDate } from "../../lib/admin";
import { formatMoney } from "../../lib/money";
import { StatusSticker } from "./DashboardPage";

const STATUSES = ["pending", "stitching", "shipped", "delivered", "cancelled"];

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("pending");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    adminRequest(`/api/v1/admin/orders/${id}`).then((data) => {
      setOrder(data);
      setStatus(data.status);
    });
  }, [id]);

  async function save(event) {
    event.preventDefault();
    const next = await adminRequest(`/api/v1/admin/orders/${id}`, { method: "PATCH", body: { status } });
    setOrder(next);
    setStatus(next.status);
    setSaved("Status saved.");
  }

  if (!order) return <p className="lede">One moment.</p>;

  const address = [order.street, order.city, order.region, order.postal].filter(Boolean).join(", ");

  return (
    <div className="desk order-detail">
      <article className="desk-card">
        <div className="order-head">
          <h2>{order.number}</h2>
          <StatusSticker status={order.status} />
        </div>
        <p>{shortDate(order.created_at)}</p>
        <p>
          {order.name} · {order.email}
          {order.phone ? ` · ${order.phone}` : ""}
        </p>
        <p>{order.method === "pickup" ? "Local pickup" : address || "Shipping"}</p>
        {order.note ? <p>Note: {order.note}</p> : null}
        <ul className="plain-list">
          {order.lines.map((line) => (
            <li key={`${line.slug}-${line.color}-${line.size}`}>
              <span>
                {line.name} · {line.color} · {line.size} · Qty {line.quantity}
              </span>
              <strong>{formatMoney(money(line.unit_price_cents * line.quantity))}</strong>
            </li>
          ))}
        </ul>
        {order.gift_wrap ? (
          <p className="sum-row">
            <span>Gift wrap</span>
            <strong>{formatMoney(money(order.gift_wrap_cents))}</strong>
          </p>
        ) : (
          <p>No gift wrap.</p>
        )}
        <p className="sum-row">
          <span>Total</span>
          <strong>{formatMoney(money(order.subtotal_cents))}</strong>
        </p>
        <form className="filter-line" onSubmit={save}>
          <label>
            Status
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              {STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </option>
              ))}
            </select>
          </label>
          <button className="btn" type="submit">
            Save status
          </button>
        </form>
        {saved ? <p className="saved-line">{saved}</p> : null}
      </article>
    </div>
  );
}
