import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { adminRequest, matchesQuery, money, shortDate } from "../../lib/admin";
import { formatMoney } from "../../lib/money";
import { StatusSticker } from "./DashboardPage";

const STATUSES = ["", "pending", "stitching", "shipped", "delivered", "cancelled"];

export default function OrdersPage() {
  const { query } = useOutletContext();
  const [status, setStatus] = useState("");
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    const path = status ? `/api/v1/admin/orders?status=${status}` : "/api/v1/admin/orders";
    adminRequest(path).then(setOrders);
  }, [status]);

  if (!orders) return <p className="lede">One moment.</p>;
  const rows = orders.filter((order) => matchesQuery(query, order.number, order.name, order.email));

  return (
    <div className="desk">
      <label className="filter-line">
        Status
        <select value={status} onChange={(event) => setStatus(event.target.value)}>
          {STATUSES.map((item) => (
            <option key={item || "all"} value={item}>
              {item ? item.charAt(0).toUpperCase() + item.slice(1) : "All"}
            </option>
          ))}
        </select>
      </label>
      <div className="desk-card table-card orders-table">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((order) => (
              <tr key={order.id}>
                <td>
                  <Link to={`/admin/orders/${order.id}`}>{order.number}</Link>
                </td>
                <td>{order.name}</td>
                <td>{shortDate(order.created_at)}</td>
                <td>{formatMoney(money(order.subtotal_cents))}</td>
                <td>
                  <StatusSticker status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="order-cards">
        {rows.map((order) => (
          <Link className="desk-card order-card" key={order.id} to={`/admin/orders/${order.id}`}>
            <strong>{order.number}</strong>
            <span>{order.name}</span>
            <span>{shortDate(order.created_at)}</span>
            <span>{formatMoney(money(order.subtotal_cents))}</span>
            <StatusSticker status={order.status} />
          </Link>
        ))}
      </div>
    </div>
  );
}
