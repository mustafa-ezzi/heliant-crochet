import { useState } from "react";
import { Gift, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Flower from "../components/Flower";
import ProductCard from "../components/ProductCard";
import QuietTable from "../components/QuietTable";
import StepGrid from "../components/StepGrid";
import { postJson, useProducts } from "../lib/catalog";
import { pageTitle } from "../lib/brand";
import { usePageTitle } from "../lib/usePageTitle";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Soft, thoughtful fibers",
    text: "picked for feel and lasting wear",
    tone: "rose",
  },
  {
    icon: Heart,
    title: "Made just for you",
    text: "colors and sizing can be yours",
    tone: "sage",
  },
  {
    icon: Gift,
    title: "Ready to give",
    text: "sweet wrapping, no extra fuss",
    tone: "sky",
  },
];

export default function HomePage() {
  const [stitchNote, setStitchNote] = useState("");
  const { status, products } = useProducts();
  usePageTitle(pageTitle("Handmade crochet, stitched slowly"));

  async function onStitchSubmit(event) {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email") || "").trim();
    try {
      await postJson("/api/v1/stitch-list", { email });
      setStitchNote("You're on the list. We'll write when a new drop is ready.");
    } catch {
      setStitchNote("The table is quiet for a moment. Please try again.");
    }
  }

  return (
    <main className="home">
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Handmade crochet</p>
            <h1>
              Soft things,
              <span>stitched slowly.</span>
            </h1>
            <p className="hero-lead">
              Small-batch crochet for bright homes and everyday adventures. Each piece is shaped by
              hand, one loop at a time.
            </p>
            <div className="hero-actions">
              <Link className="btn" to="/shop">
                <Sparkles size={17} strokeWidth={2} />
                Shop the latest
              </Link>
              <Link className="btn btn-paper" to="/about">
                About the studio
              </Link>
            </div>
            <p className="hero-aside">made by hand, kept for years ♡</p>
          </div>
          <div className="hero-photo">
            <div className="hero-frame">
              <img src="/images/heliant-hero-bag.jpg" alt="Lilac and cream floral crochet shoulder bag" />
              <span className="sticker sticker-rose">New drop</span>
            </div>
            <Flower className="hero-doodle" />
            <p className="hero-note">each piece is one of a kind</p>
          </div>
        </div>
      </section>

      <div className="scallop-to-blush" aria-hidden="true" />

      <section className="feature-band" aria-label="What to expect">
        <div className="wrap feature-grid">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div className={`feature-pill fill-${feature.tone}`} key={feature.title}>
                <Icon size={28} strokeWidth={1.75} />
                <p>
                  <strong>{feature.title}</strong>
                  {feature.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="shop-preview">
        <div className="wrap">
          <div className="section-head">
            <div>
              <p className="fresh">fresh from the hook</p>
              <h2>On the table this week</h2>
            </div>
            <Link className="text-link" to="/shop">
              See the shop →
            </Link>
          </div>
          {status === "error" ? <QuietTable /> : null}
          {status === "ready" ? (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="steps">
        <div className="wrap">
          <div className="steps-intro">
            <p className="eyebrow">Custom, without the fuss</p>
            <h2>Made for your corner</h2>
          </div>
          <StepGrid />
        </div>
      </section>

      <section className="studio">
        <div className="studio-wrap">
          <figure className="polaroid">
            <img
              src="/images/crochet-studio.jpg"
              alt="Hands crocheting lilac yarn at a sunlit table"
              loading="lazy"
            />
            <figcaption>a sunny afternoon at the table</figcaption>
          </figure>
          <div className="story">
            <Flower className="story-doodle" />
            <p className="eyebrow">The Heliant Hook studio</p>
            <h2>A small table, a lot of yarn.</h2>
            <p>
              Heliant Hook began with a hook, a basket of leftover yarn, and a wish to make everyday
              things feel more special. Pieces are worked slowly in our little studio, with color
              combinations chosen to make you smile.
            </p>
            <p>Nothing is rushed and no two stitches are exactly alike. That is the whole point.</p>
            <Link className="btn btn-paper" to="/about">
              Read our story
            </Link>
          </div>
        </div>
      </section>

      <section className="stitch">
        <div className="stitch-wrap">
          <div>
            <p className="fresh">a little note, now and then</p>
            <h2>Join the stitch list</h2>
            <p className="stitch-support">A note when a new drop is ready. No weekly noise.</p>
          </div>
          <form className="stitch-form" onSubmit={onStitchSubmit}>
            <label className="visually-hidden" htmlFor="stitch-email">
              Email
            </label>
            <input id="stitch-email" type="email" name="email" placeholder="you@example.com" required />
            <button className="btn" type="submit">
              Keep me posted
            </button>
            {stitchNote ? (
              <p className="form-note" role="status">
                {stitchNote}
              </p>
            ) : null}
          </form>
        </div>
      </section>
    </main>
  );
}
