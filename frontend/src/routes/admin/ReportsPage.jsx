import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { adminRequest, downloadCsv, matchesQuery, money } from "../../lib/admin";
import { formatMoney } from "../../lib/money";
import { RevenueBars, StatusSticker } from "./DashboardPage";

function localIso(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function thisMonth() {
  const today = new Date();
  return { from: localIso(new Date(today.getFullYear(), today.getMonth(), 1)), to: localIso(today) };
}

function thisWeek() {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  return { from: localIso(start), to: localIso(today) };
}

export default function ReportsPage() {
  const { query } = useOutletContext();
  const [range, setRange] = useState(thisMonth);
  const [status, setStatus] = useState("");
  const [report, setReport] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams({ from: range.from, to: range.to });
    if (status) params.set("status", status);
    adminRequest(`/api/v1/admin/reports?${params}`).then(setReport);
  }, [range, status]);

  if (!report) return <p className="lede">One moment.</p>;
  const rows = report.orders.filter((order) => matchesQuery(query, order.number, order.name, order.email));

  return (
    <div className="desk">
      <div className="report-controls">
        <button className="btn btn-paper" type="button" onClick={() => setRange(thisWeek())}>
          This week
        </button>
        <button className="btn btn-paper" type="button" onClick={() => setRange(thisMonth())}>
          This month
        </button>
        <label>
          From
          <input type="date" value={range.from} onChange={(event) => setRange({ ...range, from: event.target.value })} />
        </label>
        <label>
          To
          <input type="date" value={range.to} onChange={(event) => setRange({ ...range, to: event.target.value })} />
        </label>
        <label>
          Status
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="stitching">Stitching</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>
        <button className="btn" type="button" onClick={() => downloadCsv("heliant-orders.csv", rows)}>
          Download CSV
        </button>
      </div>
      <section className="stat-grid">
        <article className="stat">
          <span>Orders</span>
          <b>{report.orders_count}</b>
        </article>
        <article className="stat">
          <span>Revenue</span>
          <b>{formatMoney(money(report.revenue_cents))}</b>
        </article>
        <article className="stat">
          <span>Average order</span>
          <b>{formatMoney(money(report.average_cents))}</b>
        </article>
        <article className="stat">
          <span>Pieces sold</span>
          <b>{report.pieces}</b>
        </article>
      </section>
      <article className="desk-card">
        <h2>Revenue by day</h2>
        <RevenueBars series={report.revenue} />
      </article>
      {rows.length === 0 ? (
        <p className="empty-copy">No orders in these days.</p>
      ) : (
        <div className="desk-card table-card report-table">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((order) => (
                <tr key={order.id}>
                  <td>{order.number}</td>
                  <td>{order.name}</td>
                  <td>
                    <StatusSticker status={order.status} />
                  </td>
                  <td>{formatMoney(money(order.subtotal_cents))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {rows.length > 0 ? (
        <div className="report-cards">
          {rows.map((order) => (
            <article className="desk-card order-card" key={order.id}>
              <strong>{order.number}</strong>
              <span>{order.name}</span>
              <StatusSticker status={order.status} />
              <span>{formatMoney(money(order.subtotal_cents))}</span>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
