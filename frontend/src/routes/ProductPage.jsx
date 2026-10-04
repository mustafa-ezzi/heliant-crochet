import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import QuietTable from "../components/QuietTable";
import NotFoundPage from "./NotFoundPage";
import { useProduct } from "../lib/catalog";
import { useBag } from "../lib/bag";
import { pageTitle } from "../lib/brand";
import { formatMoney } from "../lib/money";
import { usePageTitle } from "../lib/usePageTitle";

export default function ProductPage() {
  const { slug } = useParams();
  const { status, product, related } = useProduct(slug);
  usePageTitle(pageTitle(status === "ready" ? product.name : status === "missing" ? "Not found" : "Shop"));

  if (status === "loading") {
    return (
      <main className="route-page">
        <div className="wrap">
          <p className="lede">One moment.</p>
        </div>
      </main>
    );
  }
  if (status === "error") {
    return (
      <main className="route-page">
        <div className="wrap">
          <QuietTable />
        </div>
      </main>
    );
  }
  if (!product) return <NotFoundPage />;
  return <ProductDetail key={product.slug} product={product} related={related} />;
}

function ProductDetail({ product, related }) {
  const { addItem } = useBag();
  const [photo, setPhoto] = useState(0);
  const [color, setColor] = useState(product.colors[0].name);
  const [size, setSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const photos = product.images?.length ? product.images : [product.image];
  const custom = product.category === "Custom";

  function chooseColor(name) {
    setColor(name);
    setAdded(false);
  }

  function chooseSize(name) {
    setSize(name);
    setAdded(false);
  }

  function addToBag() {
    addItem({
      slug: product.slug,
      name: product.name,
      image: product.image,
      color,
      size,
      quantity,
      price: product.price,
    });
    setAdded(true);
  }

  return (
    <main className="product-page">
      <div className="wrap pdp">
        <div className="pdp-gallery">
          <div className="pdp-frame">
            <img src={photos[photo]} alt={product.name} />
          </div>
          <div className="thumbs" role="group" aria-label="Photos">
            {photos.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                className="thumb"
                aria-pressed={photo === index}
                onClick={() => setPhoto(index)}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div className="buybox">
          <div>
            <p className="eyebrow">{product.category}</p>
            <h1>{product.name}</h1>
            <p className="pdp-price">{formatMoney(product.price)}</p>
            <p className="timing">{product.timing}</p>
          </div>

          <p className="pdp-copy">{product.description}</p>

          <div className="option-block">
            <p className="option-label">
              Color <span>{color}</span>
            </p>
            <div className="swatches" role="radiogroup" aria-label="Color">
              {product.colors.map((swatch) => (
                <button
                  key={swatch.name}
                  type="button"
                  role="radio"
                  className="swatch"
                  style={{ "--swatch": swatch.hex }}
                  aria-checked={color === swatch.name}
                  aria-label={swatch.name}
                  onClick={() => chooseColor(swatch.name)}
                />
              ))}
            </div>
          </div>

          <div className="option-block">
            <p className="option-label">
              Size <span>{size}</span>
            </p>
            <div className="filters" role="group" aria-label="Size">
              {product.sizes.map((name) => (
                <button
                  key={name}
                  type="button"
                  className="pill"
                  aria-pressed={size === name}
                  onClick={() => chooseSize(name)}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {custom ? (
            <Link className="btn buy-btn" to={`/custom?piece=${product.slug}`}>
              Start a custom order
            </Link>
          ) : (
            <>
              <div className="option-block">
                <p className="option-label">Quantity</p>
                <div className="stepper">
                  <button
                    type="button"
                    aria-label="Fewer"
                    onClick={() => {
                      setQuantity((value) => Math.max(1, value - 1));
                      setAdded(false);
                    }}
                  >
                    <Minus size={16} strokeWidth={2.4} />
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    aria-label="More"
                    onClick={() => {
                      setQuantity((value) => value + 1);
                      setAdded(false);
                    }}
                  >
                    <Plus size={16} strokeWidth={2.4} />
                  </button>
                </div>
              </div>
              <button type="button" className="btn buy-btn" onClick={addToBag}>
                Add to bag
              </button>
              {added ? (
                <p className="added" role="status">
                  In your bag.
                </p>
              ) : null}
            </>
          )}

          <ul className="reassure">
            <li>
              <span>Fiber</span>
              {product.fiber}
            </li>
            <li>
              <span>Care</span>
              {product.careShort}
            </li>
            <li>
              <span>Ships</span>
              {product.ships}
            </li>
          </ul>

          <div className="folds">
            <details className="fold">
              <summary>Story</summary>
              <p>{product.story}</p>
            </details>
            <details className="fold">
              <summary>Measurements</summary>
              <p>{product.measurements}</p>
            </details>
            <details className="fold">
              <summary>Care</summary>
              <p>{product.care}</p>
            </details>
          </div>
        </div>
      </div>

      <section className="related">
        <div className="wrap">
          <h2>More from this yarn</h2>
          <div className="catalog-grid">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
