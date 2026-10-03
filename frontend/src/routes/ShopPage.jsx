import { useSearchParams } from "react-router-dom";
import Flower from "../components/Flower";
import ProductCard from "../components/ProductCard";
import QuietTable from "../components/QuietTable";
import { useProducts } from "../lib/catalog";
import { pageTitle } from "../lib/brand";
import { usePageTitle } from "../lib/usePageTitle";

const CATEGORIES = ["All", "Wear", "Home", "Baby", "Custom"];

function pieceCount(count) {
  return `${count} ${count === 1 ? "piece" : "pieces"} ready to stitch or ship`;
}

export default function ShopPage() {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "All";
  const sort = params.get("sort") || "featured";
  const { status, products } = useProducts();
  usePageTitle(pageTitle("Shop"));

  const known = CATEGORIES.includes(category);
  const filtered = products.filter((product) => known && (category === "All" || product.category === category));
  const visible = [...filtered].sort((a, b) => {
    if (sort === "price") return a.price - b.price;
    if (sort === "newest") return b.position - a.position;
    return a.position - b.position;
  });

  function setCategory(next) {
    const nextParams = new URLSearchParams(params);
    if (next === "All") nextParams.delete("category");
    else nextParams.set("category", next);
    setParams(nextParams);
  }

  function setSort(next) {
    const nextParams = new URLSearchParams(params);
    if (next === "featured") nextParams.delete("sort");
    else nextParams.set("sort", next);
    setParams(nextParams);
  }

  return (
    <main className="shop-page">
      <header className="page-hero">
        <div className="wrap">
          <p className="eyebrow">The shop</p>
          <h1>On the table</h1>
          {status === "ready" ? <p className="lede">{pieceCount(visible.length)}</p> : null}
        </div>
      </header>

      <div className="wrap shop-body">
        <div className="shop-toolbar">
          <div className="filters" role="group" aria-label="Categories">
            {CATEGORIES.map((name) => (
              <button
                key={name}
                type="button"
                className="pill"
                aria-pressed={category === name}
                onClick={() => setCategory(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <label className="sort-field">
            <span>Sort</span>
            <select value={sort === "price" || sort === "newest" ? sort : "featured"} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">Featured</option>
              <option value="price">Price</option>
              <option value="newest">Newest</option>
            </select>
          </label>
        </div>

        {status === "error" ? <QuietTable /> : null}
        {status === "ready" && visible.length === 0 ? (
          <div className="empty-card shop-empty">
            <Flower className="doodle" />
            <h2>Nothing in this basket yet.</h2>
            <button type="button" className="btn" onClick={() => setCategory("All")}>
              Show all pieces
            </button>
          </div>
        ) : null}
        {status === "ready" && visible.length > 0 ? (
          <div className="catalog-grid">
            {visible.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
