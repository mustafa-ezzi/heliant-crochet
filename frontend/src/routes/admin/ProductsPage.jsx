import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { adminRequest, matchesQuery, money } from "../../lib/admin";
import { formatMoney } from "../../lib/money";

export default function ProductsPage() {
  const { query } = useOutletContext();
  const [products, setProducts] = useState(null);
  const [pending, setPending] = useState(null);
  const [note, setNote] = useState("");

  function load() {
    return adminRequest("/api/v1/admin/products").then((data) => setProducts(data.products));
  }

  useEffect(() => {
    load();
  }, []);

  async function remove() {
    const result = await adminRequest(`/api/v1/admin/products/${pending.id}`, { method: "DELETE" });
    setNote(result.detail || "");
    setPending(null);
    load();
  }

  if (!products) return <p className="lede">One moment.</p>;
  const rows = products.filter((product) => matchesQuery(query, product.name, product.category, product.slug));

  return (
    <div className="desk">
      <div className="desk-actions">
        <Link className="btn" to="/admin/products/new">
          New piece
        </Link>
      </div>
      {note ? <p className="saved-line">{note}</p> : null}
      <div className="desk-card table-card catalog-table">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((product) => (
              <tr key={product.id}>
                <td>{product.image ? <img className="thumb" src={product.image} alt="" /> : <span className="thumb" />}</td>
                <td>{product.name}</td>
                <td>{formatMoney(money(product.price_cents))}</td>
                <td>{product.category}</td>
                <td>{product.hidden ? "Hidden" : "On the table"}</td>
                <td className="row-actions">
                  <Link to={`/admin/products/${product.id}`}>Edit</Link>
                  <button type="button" onClick={() => setPending(product)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="piece-cards">
        {rows.map((product) => (
          <article className="desk-card order-card" key={product.id}>
            <div className="piece-line">
              {product.image ? <img className="thumb" src={product.image} alt="" /> : <span className="thumb" />}
              <strong>{product.name}</strong>
            </div>
            <span>{formatMoney(money(product.price_cents))}</span>
            <span>{product.category}</span>
            <span>{product.hidden ? "Hidden" : "On the table"}</span>
            <div className="row-actions">
              <Link to={`/admin/products/${product.id}`}>Edit</Link>
              <button type="button" onClick={() => setPending(product)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
      {pending ? (
        <div className="desk-dialog" role="dialog" aria-labelledby="remove-piece">
          <div className="paper-form">
            <h2 id="remove-piece">Take {pending.name} off the table?</h2>
            <p>If it has been ordered, it stays in those orders and leaves the shop.</p>
            <div className="desk-actions">
              <button className="btn" type="button" onClick={remove}>
                Remove
              </button>
              <button className="btn btn-paper" type="button" onClick={() => setPending(null)}>
                Keep it
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
