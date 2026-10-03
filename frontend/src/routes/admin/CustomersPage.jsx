import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { adminRequest, matchesQuery, money, shortDate } from "../../lib/admin";
import { formatMoney } from "../../lib/money";
import { StatusSticker } from "./DashboardPage";

export default function CustomersPage() {
  const { query } = useOutletContext();
  const [desk, setDesk] = useState(null);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    adminRequest("/api/v1/admin/customers").then(setDesk);
  }, []);

  async function openCustomer(id) {
    const detail = await adminRequest(`/api/v1/admin/customers/${id}`);
    setOpen(detail);
  }

  if (!desk) return <p className="lede">One moment.</p>;
  const rows = desk.customers.filter((customer) => matchesQuery(query, customer.name, customer.email));

  return (
    <div className="desk">
      <div className="desk-card table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Orders</th>
              <th>Spent</th>
              <th>Last order</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((customer) => (
              <tr key={customer.id} onClick={() => openCustomer(customer.id)} className="click-row">
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.orders_count}</td>
                <td>{formatMoney(money(customer.spent_cents))}</td>
                <td>{shortDate(customer.last_order)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {open ? (
        <article className="desk-card">
          <h2>{open.name}</h2>
          <p>{open.email}</p>
          {open.orders.length === 0 ? <p>No orders yet.</p> : null}
          <ul className="plain-list">
            {open.orders.map((order) => (
              <li key={order.id}>
                <span>{order.number}</span>
                <StatusSticker status={order.status} />
                <strong>{formatMoney(money(order.subtotal_cents))}</strong>
              </li>
            ))}
          </ul>
        </article>
      ) : null}
      <section className="chart-grid">
        <article className="desk-card">
          <h2>Custom requests</h2>
          <ul className="plain-list">
            {desk.custom_requests.map((item) => (
              <li key={item.id}>
                <span>
                  {item.name} · {item.want}
                </span>
              </li>
            ))}
          </ul>
        </article>
        <article className="desk-card">
          <h2>Stitch list</h2>
          <ul className="plain-list">
            {desk.stitch_list.map((item) => (
              <li key={item.id}>
                <span>{item.email}</span>
                <span>{shortDate(item.created_at)}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
