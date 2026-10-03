import { Link } from "react-router-dom";
import Flower from "../components/Flower";
import { pageTitle } from "../lib/brand";
import { usePageTitle } from "../lib/usePageTitle";

const MAKES = [
  {
    title: "Wear",
    text: "Bags, hats, and pieces you can take with you.",
    to: "/shop?category=Wear",
    tone: "rose",
  },
  {
    title: "Home",
    text: "Cushions and soft things for the room you love.",
    to: "/shop?category=Home",
    tone: "sage",
  },
  {
    title: "Baby",
    text: "Small stitches for the littlest people.",
    to: "/shop?category=Baby",
    tone: "sky",
  },
  {
    title: "Custom",
    text: "A piece shaped around your colors and size.",
    to: "/custom",
    tone: "butter",
  },
];

export default function AboutPage() {
  usePageTitle(pageTitle("About"));

  return (
    <main>
      <header className="page-hero">
        <div className="wrap">
          <p className="eyebrow">The Heliant Hook studio</p>
          <h1>A small table, a lot of yarn.</h1>
          <p className="lede">
            Welcome in. This is the quiet work of one hook, one loop, and colors chosen to make you
            smile.
          </p>
        </div>
      </header>

      <section className="about-story" aria-label="Studio story">
        <div className="studio-wrap">
          <figure className="polaroid">
            <img
              src="/images/crochet-studio.jpg"
              alt="Hands crocheting lilac yarn at a sunlit table"
            />
            <figcaption>a sunny afternoon at the table</figcaption>
          </figure>
          <div className="story">
            <Flower className="story-doodle" />
            <p className="eyebrow">How it started</p>
            <h2>Slow on purpose.</h2>
            <p>
              Heliant Hook began with a hook, a basket of leftover yarn, and a wish to make everyday
              things feel more special. Pieces are worked slowly in our little studio, with color
              combinations chosen to make you smile.
            </p>
            <p>Nothing is rushed and no two stitches are exactly alike. That is the whole point.</p>
            <p>
              The table holds whatever is in progress: a bag, a hat, a cushion, sometimes a custom
              order with a note about a color someone loves.
            </p>
          </div>
        </div>
      </section>

      <section className="makes" aria-labelledby="makes-heading">
        <div className="wrap">
          <h2 id="makes-heading">What we make</h2>
          <div className="make-grid">
            {MAKES.map((item) => (
              <Link className={`make-card fill-${item.tone}`} key={item.title} to={item.to}>
                <Flower />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="materials">
        <div className="wrap">
          <article className="stitched">
            <p className="eyebrow">Materials and care</p>
            <h2>Yarn, water, and a little patience.</h2>
            <p>
              We stitch with cotton, wool blends, and recycled cotton. Colors are dyed or chosen in
              batches, so two pieces of the same name can differ a little. That variation is part of
              the making.
            </p>
            <p>Hand wash cool, reshape gently, and dry flat. Keep the piece out of the dryer.</p>
          </article>
        </div>
      </section>

      <section className="closing-band">
        <div className="wrap">
          <h2>Come find something soft.</h2>
          <Link className="btn btn-butter" to="/shop">
            Shop the latest
          </Link>
        </div>
      </section>
    </main>
  );
}
