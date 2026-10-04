import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { adminRequest, matchesQuery, money, shortDate } from "../../lib/admin";
import { SHOP_FONTS, shopFont } from "../../lib/fonts";
import { formatMoney } from "../../lib/money";

const STATUS = {
  pending: "Pending",
  stitching: "Stitching",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function StatusSticker({ status }) {
  return <span className={`status-sticker status-${status}`}>{STATUS[status] || status}</span>;
}

export function RevenueBars({ series }) {
  const max = Math.max(...series.map((item) => item.cents), 1);
  return (
    <div className="bar-chart" role="img" aria-label="Revenue by day">
      {series.map((item) => (
        <div className="bar-col" key={item.date}>
          <div className="bar-track">
            <div className="bar" style={{ height: `${Math.max(4, (item.cents / max) * 100)}%` }} />
          </div>
          <span>{Number(item.date.slice(-2))}</span>
        </div>
      ))}
    </div>
  );
}

export function StatusBars({ statuses }) {
  const max = Math.max(...statuses.map((item) => item.count), 1);
  return (
    <div className="status-bars" role="img" aria-label="Orders by status">
      {statuses.map((item) => (
        <div className="status-row" key={item.status}>
          <span>{STATUS[item.status]}</span>
          <div className="status-track">
            <div className={`status-fill status-${item.status}`} style={{ width: `${(item.count / max) * 100}%` }} />
          </div>
          <b>{item.count}</b>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { query } = useOutletContext();
  const [desk, setDesk] = useState(null);
  const [note, setNote] = useState("");
  const [gift, setGift] = useState("6");
  const [font, setFont] = useState("studio");
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    adminRequest("/api/v1/admin/dashboard").then((data) => {
      setDesk(data);
      setNote(data.announcement);
      setGift(String(data.gift_wrap_cents / 100));
      setFont(data.font || "studio");
    });
  }, []);

  async function saveSettings(event) {
    event.preventDefault();
    setSaved("");
    setError("");
    const cents = Math.round(Number(gift) * 100);
    try {
      const next = await adminRequest("/api/v1/admin/settings", {
        method: "PATCH",
        body: { announcement: note, gift_wrap_cents: cents, font },
      });
      setSaved("Saved. Reload the shop to see this font.");
      setNote(next.announcement);
      setFont(next.font || font);
    } catch (err) {
      setError(err.payload?.announcement || err.payload?.gift_wrap || err.payload?.font || err.message);
    }
  }

  if (!desk) return <p className="lede">One moment.</p>;

  const latest = desk.latest.filter((order) => matchesQuery(query, order.number, order.name, order.email));

  return (
    <div className="desk">
      <section className="stat-grid">
        <article className="stat">
          <span>Revenue this month</span>
          <b>{formatMoney(money(desk.revenue_cents))}</b>
        </article>
        <article className="stat">
          <span>Orders this month</span>
          <b>{desk.orders_this_month}</b>
        </article>
        <article className="stat">
          <span>Open orders</span>
          <b>{desk.open_orders}</b>
        </article>
        <article className="stat">
          <span>Customers</span>
          <b>{desk.customers}</b>
        </article>
      </section>

      <section className="chart-grid">
        <article className="desk-card">
          <h2>Revenue, last 30 days</h2>
          <RevenueBars series={desk.revenue} />
        </article>
        <article className="desk-card">
          <h2>Orders by status</h2>
          <StatusBars statuses={desk.statuses} />
        </article>
      </section>

      <section className="chart-grid">
        <article className="desk-card">
          <h2>Latest orders</h2>
          <ul className="plain-list">
            {latest.map((order) => (
              <li key={order.id}>
                <Link to={`/admin/orders/${order.id}`}>{order.number}</Link>
                <span>{order.name}</span>
                <StatusSticker status={order.status} />
                <strong>{formatMoney(money(order.subtotal_cents))}</strong>
              </li>
            ))}
          </ul>
        </article>
        <article className="desk-card">
          <h2>Top pieces</h2>
          <ul className="plain-list">
            {desk.top_pieces.map((piece) => (
              <li key={piece.slug}>
                <span>{piece.name}</span>
                <strong>{piece.pieces}</strong>
              </li>
            ))}
          </ul>
          <form className="studio-settings" onSubmit={saveSettings}>
            <h2>Shop line</h2>
            <label htmlFor="announcement">Announcement</label>
            <textarea id="announcement" value={note} onChange={(event) => setNote(event.target.value)} rows={3} />
            <label htmlFor="gift-wrap">Gift wrap (PKR)</label>
            <input id="gift-wrap" value={gift} onChange={(event) => setGift(event.target.value)} inputMode="decimal" />
            <label htmlFor="shop-font">Shop font</label>
            <select id="shop-font" value={font} onChange={(event) => setFont(event.target.value)}>
              {SHOP_FONTS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            <p className="font-preview" style={{ fontFamily: shopFont(font).display }}>
              heliant hook
              <span style={{ fontFamily: shopFont(font).body }}>Handmade, stitched slowly.</span>
            </p>
            {error ? <p className="error">{error}</p> : null}
            {saved ? <p className="saved-line">{saved}</p> : null}
            <button className="btn" type="submit">
              Save
            </button>
          </form>
        </article>
      </section>
      <p className="quiet-date">Latest order {latest[0] ? shortDate(latest[0].created_at) : "—"}</p>
    </div>
  );
}
