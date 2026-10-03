import { Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import Flower from "../components/Flower";
import { GIFT_WRAP, bagSubtotal, useBag } from "../lib/bag";
import { useStudioSettings } from "../lib/studio";
import { formatMoney } from "../lib/money";
import { pageTitle } from "../lib/brand";
import { usePageTitle } from "../lib/usePageTitle";

export default function CartPage() {
  const { lines, giftWrap, setGiftWrap, setQuantity, removeLine } = useBag();
  const { giftWrap: giftWrapAmount } = useStudioSettings();
  usePageTitle(pageTitle("Bag"));

  if (lines.length === 0) {
    return (
      <main className="route-page">
        <div className="wrap">
          <article className="empty-card">
            <Flower className="doodle" />
            <h1>Your bag is waiting for something soft.</h1>
            <Link className="btn" to="/shop">
              Shop the latest
            </Link>
          </article>
        </div>
      </main>
    );
  }

  return (
    <main className="bag-page">
      <header className="page-hero">
        <div className="wrap">
          <p className="eyebrow">Your bag</p>
          <h1>Bag</h1>
        </div>
      </header>
      <div className="wrap bag-body">
        <div className="cart-layout">
          <div className="bag-card">
            {lines.map((line) => (
              <article className="bag-line" key={line.key}>
                <img src={line.image} alt="" />
                <div>
                  <h2>{line.name}</h2>
                  <p>
                    {line.color} · {line.size}
                  </p>
                  <div className="line-actions">
                    <div className="stepper">
                      <button
                        type="button"
                        aria-label={`Fewer ${line.name}`}
                        onClick={() => setQuantity(line.key, line.quantity - 1)}
                      >
                        <Minus size={16} strokeWidth={2.4} />
                      </button>
                      <span>{line.quantity}</span>
                      <button
                        type="button"
                        aria-label={`More ${line.name}`}
                        onClick={() => setQuantity(line.key, line.quantity + 1)}
                      >
                        <Plus size={16} strokeWidth={2.4} />
                      </button>
                    </div>
                    <button type="button" className="remove-line" onClick={() => removeLine(line.key)}>
                      Remove
                    </button>
                  </div>
                </div>
                <p className="bag-price">{formatMoney(line.price * line.quantity)}</p>
              </article>
            ))}
          </div>

          <aside className="summary-card">
            <h2>Summary</h2>
            <label className="gift-row">
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={(event) => setGiftWrap(event.target.checked)}
              />
              <span>Gift wrap</span>
              <span className="gift-price">+{formatMoney(giftWrapAmount || GIFT_WRAP)}</span>
            </label>
            <p className="sum-row">
              <span>Subtotal</span>
              <strong>{formatMoney(bagSubtotal(lines, giftWrap, giftWrapAmount || GIFT_WRAP))}</strong>
            </p>
            <p className="ship-note">Shipping is calculated at checkout</p>
            <Link className="btn" to="/checkout">
              Checkout
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
