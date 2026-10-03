# Heliant — Design System

The build sequence, route map, and resolved measurements live in `HELIANT_DEVELOPMENT_PLAN.md`. Where that file and this one disagree — heading tracking, type scale, header, nav breakpoint, primary-button shadow, home copy, and motion — follow the development plan. This file remains the component and CSS reference.

Soft neo-brutalism for a handmade crochet shop. The UI keeps the brutalist habits people recognize — a visible border, a hard offset shadow, flat color blocks, sticker buttons — and softens every one of them so the shop feels like a sunny worktable, not a poster.

Brand: **Heliant**
Stack this system is written for: React storefront, Django API + admin, PostgreSQL, Railway.

The logo is the palette. Deep plum ground, a folded lilac cloth, white botanical linework. The site does not sit on that dark ground. The dark plum becomes ink: borders, headlines, and the shadow on primary buttons. The page itself is warm cream, like pattern paper on a table.

---

## 1. Feel

**Welcoming, handmade, a little playful.** A person landing here should feel they walked into a small studio, not a warehouse.

Do this:

- Round the corners. Brutalism here uses 14–22px radius, never sharp 0px boxes.
- Color the shadow lilac, not pure black. Black offset shadows read angry. Lilac ones read like a paper cutout on a desk.
- Use plum for borders (about 2px). Thick enough to see, thin enough not to shout.
- Leave cream space. Crochet is texture; the page should not compete with the yarn photos.
- Hand-letter only the small asides: “made to order”, “a few left”, “stitched this week”.
- Repeat the logo’s flower as a line doodle, never as a filled clip-art bloom.

Avoid:

- Pure black (`#000`) anywhere in the chrome.
- Neon, heavy gradients, glassmorphism, or tiny gray SaaS cards.
- All-caps shouting, except short nav labels at a small size.
- Drop shadows that blur. Soft brutalism is offset and flat, with almost no blur.
- Stock “girl boss” pink. Pinks here are dusty blush mixed from the plum, not hot magenta.

Reference mood (translated, not copied):

| Reference | What to borrow | What to leave |
| --- | --- | --- |
| Nectar candy cart | Cream grid paper, scalloped section edges, serif headlines, sticker prices, a weekly “where to find us” feeling | Burgundy and candy-red as the brand color |
| She Made It | Step cards, thick colored frames, checker bands, chunky pill buttons | Orange borders and heavy checker wallpaper |
| Moonwell | Soft lilac fields, polaroid product notes, tiny star/flower scatter, rounded product stage | Sleepy gradient-only layouts with no border |

---

## 2. Color

Sampled from the logo and then extended into tints a shop can actually live in. The two logo colors are **Ink** and **Violet**. Everything else is a tint, a warm paper, or a tiny butter sticker.

| Token | Hex | Role |
| --- | --- | --- |
| `--ink` | `#3C145F` | Logo ground. Headlines, borders, primary button fill |
| `--plum` | `#6E3D93` | Secondary text, icons, links |
| `--violet` | `#A56CC4` | Logo cloth. Filled shapes, illustration, active chips |
| `--lilac` | `#D7B6EA` | Offset shadows, tags, hover washes |
| `--petal` | `#F4E7FA` | Soft panels, input focus ring fill |
| `--blush` | `#F8E6F0` | Alternate sections, “new” stickers |
| `--cream` | `#FFF8F3` | Page background. Warm, not stark white |
| `--paper` | `#FFFCFA` | Cards and form fields |
| `--butter` | `#F6E3A1` | Tiny stickers only: sale, handmade, note |
| `--peach` | `#F8D3B8` | Warm yarn fill: feature rows, step badges, made-to-order stickers |
| `--sage` | `#DCE8CC` | Leaf fill: care notes, home pieces, step badges |
| `--sky` | `#D9E0F8` | Cool fill: gifts, baby, custom stickers, the stitch list |
| `--rose` | `#E7A3C4` | Heart, wishlist, error-adjacent warmth |
| `--line` | `#FFFFFF` | Logo line art, text on ink buttons |
| `--success` | `#3E7A5A` | In stock, paid. Green is functional, used small |
| `--warning` | `#9A6420` | Low stock text |
| `--danger` | `#9B3D55` | Form errors, remove. Dusty, not alarm red |

Contrast rules:

- Body text is `--ink` on `--cream` or `--paper`. Do not set body text in `--violet`; it fails contrast.
- Text on `--ink` buttons is `--line` (white).
- `--lilac`, `--butter`, `--peach`, `--sage`, `--sky`, and `--rose` are fills. Put `--ink` text on them.
- Muted captions use `--plum`, never a gray.

```css
:root {
  --ink: #3c145f;
  --plum: #6e3d93;
  --violet: #a56cc4;
  --lilac: #d7b6ea;
  --petal: #f4e7fa;
  --blush: #f8e6f0;
  --cream: #fff8f3;
  --paper: #fffcfa;
  --butter: #f6e3a1;
  --peach: #f8d3b8;
  --sage: #dce8cc;
  --sky: #d9e0f8;
  --rose: #e7a3c4;
  --line: #ffffff;
  --success: #3e7a5a;
  --warning: #9a6420;
  --danger: #9b3d55;

  --border: 2px solid var(--ink);
  --radius-sm: 12px;
  --radius: 18px;
  --radius-lg: 28px;
  --radius-pill: 999px;

  --shadow: 4px 5px 0 var(--lilac);
  --shadow-ink: 4px 5px 0 var(--ink);
  --shadow-press: 2px 2px 0 var(--lilac);
  --shadow-rose: 4px 5px 0 #f3c6da;

  --font-display: "Fraunces", "Iowan Old Style", Palatino, serif;
  --font-body: "Nunito", "Avenir Next", "Segoe UI", sans-serif;
  --font-hand: "Caveat", "Segoe Script", cursive;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 72px;
  --space-9: 104px;

  --content: 1120px;
  --content-narrow: 720px;
  --header-h: 76px;

  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  --fast: 140ms;
  --med: 220ms;
}
```

---

## 3. Type

Three families, used with a light hand.

| Role | Family | Use |
| --- | --- | --- |
| Display | Fraunces | Page titles, product names, prices on the product page |
| Body | Nunito | Navigation, paragraphs, buttons, forms, admin |
| Hand | Caveat | One short aside per section. Never a paragraph |

```css
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Fraunces:opsz,wght@9..144,520;9..144,640;9..144,700&family=Nunito:wght@400;600;700;800&display=swap");

body {
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.6;
  color: var(--ink);
  background: var(--cream);
  font-weight: 500;
}

h1, h2, h3, .display {
  font-family: var(--font-display);
  font-weight: 640;
  letter-spacing: -0.02em;
  line-height: 1.08;
  color: var(--ink);
}

h1 { font-size: clamp(40px, 6vw, 68px); }
h2 { font-size: clamp(30px, 4vw, 44px); }
h3 { font-size: clamp(22px, 2.4vw, 28px); }

.hand {
  font-family: var(--font-hand);
  font-weight: 600;
  font-size: 1.35rem;
  line-height: 1;
  color: var(--plum);
}

.eyebrow {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--plum);
}

.price {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.35rem;
}
```

Nunito at weight 500 (not 400) keeps small UI text from looking thin next to the chunky borders. Fraunces stays in the 520–700 range so headlines feel soft, not black-poster bold.

---

## 4. Page paper, grid, scallops, stitches

The background is cream with a faint graph-paper grid, like a printed pattern sheet. Grid lines are petal-lilac at low opacity so photos stay the loudest thing on the page.

```css
body {
  background-color: var(--cream);
  background-image:
    linear-gradient(to right, rgba(165, 108, 196, 0.13) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(165, 108, 196, 0.13) 1px, transparent 1px);
  background-size: 28px 28px;
  background-attachment: fixed;
}

.section {
  padding: var(--space-8) var(--space-5);
}

.wrap {
  width: min(var(--content), calc(100% - 40px));
  margin-inline: auto;
}

.wrap-narrow {
  width: min(var(--content-narrow), calc(100% - 40px));
  margin-inline: auto;
}

/* Solid bands sit on top of the grid so text has a quiet field. */
.band {
  background: var(--paper);
  border-block: var(--border);
}

.band-blush { background: var(--blush); }
.band-petal { background: var(--petal); }
.band-ink {
  background: var(--ink);
  color: var(--line);
  border-block: var(--border);
}
.band-ink h2,
.band-ink .eyebrow { color: var(--line); }
```

Scalloped edge between two sections. Drop this under a hero or above the footer. It is the Nectar scallop, redrawn in plum.

```css
.scallop {
  height: 22px;
  background:
    radial-gradient(circle at 14px 0, transparent 13px, var(--paper) 14px) left top / 28px 22px repeat-x;
}
.scallop-cream {
  background:
    radial-gradient(circle at 14px 0, transparent 13px, var(--cream) 14px) left top / 28px 22px repeat-x;
}
.scallop-ink {
  background:
    radial-gradient(circle at 14px 0, transparent 13px, var(--ink) 14px) left top / 28px 22px repeat-x;
}
```

A stitch border for notes, pattern cards, and the “handmade” callout. Dashed, round caps, plum.

```css
.stitched {
  border: 2px dashed var(--plum);
  border-radius: var(--radius);
  background: var(--paper);
  box-shadow: var(--shadow);
}
```

Checker is a short band, not a page wallpaper. Use it once: under the announcement bar, or behind the “how a custom order works” steps.

```css
.checker {
  background-color: var(--blush);
  background-image:
    linear-gradient(45deg, var(--petal) 25%, transparent 25%),
    linear-gradient(-45deg, var(--petal) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, var(--petal) 75%),
    linear-gradient(-45deg, transparent 75%, var(--petal) 75%);
  background-size: 22px 22px;
  background-position: 0 0, 0 11px, 11px -11px, -11px 0;
}
```

Flower doodle. Inline SVG, stroke only, same white-on-plum or plum-on-cream as the logo. Use it in corners of the hero and as an empty-state illustration. Do not fill the petals.

```svg
<svg viewBox="0 0 80 120" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true">
  <path d="M40 108 C40 78 28 70 34 48"/>
  <path d="M34 48 C22 40 18 26 30 22 C36 20 40 28 40 34 C40 26 48 16 58 20 C68 24 64 40 50 46 C44 48 38 48 34 48Z"/>
  <circle cx="40" cy="32" r="3"/>
  <path d="M46 70 C58 60 70 62 66 78"/>
</svg>
```

---

## 5. Surfaces

Every card is a paper slip: cream or white fill, plum border, lilac offset shadow. Hover lifts the slip 2px and shrinks the shadow, like picking it up. Press sinks it.

```css
.card {
  background: var(--paper);
  border: var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: var(--space-5);
}

.card-hover {
  transition: transform var(--med) var(--ease), box-shadow var(--med) var(--ease);
}
.card-hover:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 7px 0 var(--lilac);
}
.card-hover:active {
  transform: translate(2px, 2px);
  box-shadow: var(--shadow-press);
}

.cluster {
  display: grid;
  gap: var(--space-5);
}
.cluster-3 { grid-template-columns: repeat(3, 1fr); }
.cluster-4 { grid-template-columns: repeat(4, 1fr); }
.cluster-2 { grid-template-columns: 1.1fr 0.9fr; }

@media (max-width: 900px) {
  .cluster-3, .cluster-4, .cluster-2 { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 640px) {
  .cluster-3, .cluster-4, .cluster-2 { grid-template-columns: 1fr; }
}
```

Polaroid frame for “on the hook” process photos and reviews. Slight rotation on the nth child, never more than 2 degrees.

```css
.polaroid {
  background: var(--paper);
  border: var(--border);
  border-radius: 14px;
  box-shadow: var(--shadow);
  padding: 12px 12px 36px;
}
.polaroid img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 8px;
  border: var(--border);
}
.polaroid figcaption {
  font-family: var(--font-hand);
  font-size: 1.25rem;
  text-align: center;
  margin-top: 8px;
}
.polaroid:nth-child(3n + 1) { transform: rotate(-1.25deg); }
.polaroid:nth-child(3n + 2) { transform: rotate(1deg); }
```

---

## 6. Buttons, links, stickers

Primary button is an ink slab with a lilac shadow. Secondary is paper with an ink border. The third style is a butter sticker for “add a note” type actions, used rarely.

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  padding: 0 22px;
  border: var(--border);
  border-radius: var(--radius-pill);
  background: var(--ink);
  color: var(--line);
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 15px;
  letter-spacing: 0.01em;
  box-shadow: var(--shadow);
  cursor: pointer;
  text-decoration: none;
  transition: transform var(--fast) var(--ease), box-shadow var(--fast) var(--ease);
}
.btn:hover { transform: translate(-2px, -2px); box-shadow: 6px 7px 0 var(--lilac); }
.btn:active { transform: translate(2px, 2px); box-shadow: var(--shadow-press); }
.btn:focus-visible {
  outline: 3px solid var(--violet);
  outline-offset: 3px;
}

.btn-paper {
  background: var(--paper);
  color: var(--ink);
}
.btn-butter {
  background: var(--butter);
  color: var(--ink);
  box-shadow: var(--shadow-ink);
}
.btn-rose {
  background: var(--rose);
  color: var(--ink);
  box-shadow: 4px 5px 0 var(--ink);
}
.btn-block { width: 100%; }
.btn[disabled], .btn.is-disabled {
  opacity: 0.45;
  pointer-events: none;
  box-shadow: none;
}

.link {
  color: var(--plum);
  font-weight: 800;
  text-underline-offset: 3px;
}
.link:hover { color: var(--ink); }
```

Stickers sit on the corner of a product photo, slightly rotated.

```css
.sticker {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 2px 10px;
  border: 2px solid var(--ink);
  border-radius: var(--radius-pill);
  background: var(--butter);
  color: var(--ink);
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  box-shadow: 2px 2px 0 var(--ink);
  transform: rotate(-3deg);
}
.sticker-lilac { background: var(--lilac); }
.sticker-blush { background: var(--blush); }
.sticker-rose { background: var(--rose); transform: rotate(2deg); }
```

Price pebble, used on listing cards (the candy-shop price blobs, in this palette):

```css
.price-pebble {
  display: grid;
  place-items: center;
  min-width: 84px;
  min-height: 64px;
  padding: 8px 12px;
  background: var(--petal);
  border: var(--border);
  border-radius: 40% 45% 42% 48%;
  box-shadow: var(--shadow);
  font-family: var(--font-display);
  font-weight: 700;
}
.price-pebble small {
  display: block;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--plum);
}
```

---

## 7. Forms

Inputs look like labeled paper tags. The label sits above the field, in Nunito extra-bold, small. Focus fills the field with petal and keeps the ink border. Errors use dusty rose text plus a rose shadow, not a shaking red box.

```css
.field { display: flex; flex-direction: column; gap: 6px; }
.field label {
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--plum);
}
.field input,
.field textarea,
.field select {
  min-height: 48px;
  padding: 12px 14px;
  border: var(--border);
  border-radius: var(--radius-sm);
  background: var(--paper);
  color: var(--ink);
  font: inherit;
  box-shadow: var(--shadow-press);
}
.field textarea { min-height: 140px; resize: vertical; }
.field input:focus,
.field textarea:focus,
.field select:focus {
  outline: none;
  background: var(--petal);
  box-shadow: var(--shadow);
}
.field .hint { font-size: 13px; color: var(--plum); font-weight: 600; }
.field.is-error input,
.field.is-error textarea { box-shadow: 3px 3px 0 var(--rose); }
.field .error { color: var(--danger); font-weight: 800; font-size: 13px; }

.qty {
  display: inline-flex;
  border: var(--border);
  border-radius: var(--radius-pill);
  overflow: hidden;
  background: var(--paper);
  box-shadow: var(--shadow-press);
}
.qty button {
  width: 40px;
  height: 40px;
  border: 0;
  background: var(--petal);
  color: var(--ink);
  font-weight: 800;
  cursor: pointer;
}
.qty input {
  width: 48px;
  border: 0;
  text-align: center;
  font: inherit;
  font-weight: 800;
  background: transparent;
}
```

---

## 8. Storefront chrome

### Announcement bar

One line, checker or petal, hand-lettered aside allowed. Example copy: “Made to order in small batches · ships in 5–10 days”.

```css
.announce {
  background: var(--petal);
  border-bottom: var(--border);
  text-align: center;
  padding: 8px 16px;
  font-weight: 800;
  font-size: 14px;
}
```

### Header

Sticky, cream, ink border along the bottom, no blur. Wordmark set in Fraunces. Nav in Nunito 800, small caps tracking. Cart is a round ink badge.

```css
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  height: var(--header-h);
  display: flex;
  align-items: center;
  background: var(--cream);
  border-bottom: var(--border);
}
.header-inner {
  width: min(var(--content), calc(100% - 40px));
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.wordmark {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 28px;
  letter-spacing: -0.03em;
  color: var(--ink);
  text-decoration: none;
}
.wordmark span {
  color: var(--violet);
}
.nav { display: flex; gap: 22px; }
.nav a {
  color: var(--ink);
  text-decoration: none;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.nav a[aria-current="page"] {
  background: var(--butter);
  border: 2px solid var(--ink);
  border-radius: var(--radius-pill);
  padding: 4px 10px;
  box-shadow: 2px 2px 0 var(--lilac);
}
.icon-btn {
  width: 46px;
  height: 46px;
  border: var(--border);
  border-radius: 50%;
  background: var(--paper);
  box-shadow: var(--shadow-press);
  display: grid;
  place-items: center;
  position: relative;
  cursor: pointer;
}
.cart-count {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: var(--radius-pill);
  background: var(--rose);
  border: 2px solid var(--ink);
  font-size: 11px;
  font-weight: 800;
  display: grid;
  place-items: center;
}
```

Nav items: **Home · About · Shop · Contact**. Cart and account sit on the right. On small screens the links collapse into a sheet that slides down under the header (same paper, same border), not a dark drawer.

Logo lockup: the flower-and-cloth mark at 36px, then the word **heliant** in Fraunces lowercase. The cloth shape in the logo can be echoed by coloring the letters `ant` in `--violet` if the mark is not shown. Prefer the mark plus the full word.

### Footer

Ink band, white type, scallop along the top edge. Three columns: visit / shop, help, a short note in Caveat. Social icons are 40px circles with a 2px white border, not bare glyphs.

```css
.footer {
  background: var(--ink);
  color: var(--line);
  padding: var(--space-8) var(--space-5) var(--space-6);
}
.footer a { color: var(--lilac); font-weight: 700; }
.footer h3 { color: var(--line); font-size: 22px; }
.footer .fine {
  opacity: 0.8;
  font-size: 13px;
  margin-top: var(--space-6);
}
```

---

## 9. Pages

Shared page hero for interior pages (About, Shop, Contact, Cart). Left-aligned title, one sentence, a hand-lettered scribble. No full-bleed stock photo behind the title.

```css
.page-hero { padding: var(--space-7) 0 var(--space-5); }
.page-hero p { max-width: 46ch; font-size: 18px; }
```

### Home

Order of the page, top to bottom:

1. **Announcement** — shipping or drop note.
2. **Hero** — two columns. Left: eyebrow “handmade crochet”, H1 such as “Soft things, stitched slowly.”, two lines of body, primary “Shop the latest” and paper “About the studio”. Right: a product photo in a card with a sticker (“new drop”) and one flower doodle overlapping the corner, plus a butter note in Caveat (“each piece is one of a kind”).
3. **Scallop** into a blush band: three feature pills — fiber, made to order, gift wrap. Icon + one line. Icons are 28px line drawings, plum stroke.
4. **Shop preview** — “On the table this week”. Four product cards. Link “See the shop”.
5. **How it works** — three step cards on a short checker band. Step 1 choose a piece or a custom. Step 2 tell us colors and size. Step 3 we stitch it and send tracking.
6. **About strip** — photo polaroid overlapping a petal card with a short studio paragraph and “Read our story”.
7. **Note / club** — optional “Join the stitch list” email row. Paper field + ink button, one line of reassurance (“a note when a new drop is ready. no weekly noise.”).
8. **Footer**.

Hero layout:

```css
.hero {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: var(--space-7);
  align-items: center;
  padding: var(--space-7) 0 var(--space-8);
}
.hero-photo {
  position: relative;
}
.hero-photo .card { padding: 14px; }
.hero-photo img {
  width: 100%;
  border-radius: 12px;
  aspect-ratio: 4 / 5;
  object-fit: cover;
  border: var(--border);
}
.hero-note {
  position: absolute;
  right: -12px;
  bottom: 28px;
  max-width: 180px;
  background: var(--butter);
  border: var(--border);
  border-radius: 16px 18px 14px 20px;
  padding: 12px 14px;
  box-shadow: var(--shadow-ink);
  font-family: var(--font-hand);
  font-size: 1.4rem;
  line-height: 1.1;
  transform: rotate(2deg);
}
@media (max-width: 800px) {
  .hero { grid-template-columns: 1fr; }
  .hero-note { right: 8px; }
}
```

### About

A story page, not a timeline of logos.

- Page hero.
- Two-column: portrait polaroid, then the studio story in a narrow measure (65ch).
- A “what we make” row: wearables, home, gifts, custom. Four small cards, flower doodle as the icon.
- Materials note in a stitched card: yarn types, care, the fact that colors vary because they are hand-dyed or batch-dyed.
- Closing band, ink background, one sentence and a “Shop” button in butter.

### Shop

- Page hero with a one-line count: “24 pieces ready to stitch or ship”.
- Filter row: pills for category (All, Wear, Home, Baby, Custom). Active pill is butter with an ink border. Sort sits on the right as a paper select.
- Product grid, 3 columns, gap 24px. 2 columns under 900px, 1 column under 640px.
- Empty filter: a flower doodle, “Nothing in this basket yet”, link back to All.

```css
.filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: var(--space-5); }
.pill {
  min-height: 40px;
  padding: 0 14px;
  border: var(--border);
  border-radius: var(--radius-pill);
  background: var(--paper);
  font-weight: 800;
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--lilac);
}
.pill[aria-pressed="true"] { background: var(--butter); }
```

Product card:

```css
.product-card {
  background: var(--paper);
  border: var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  transition: transform var(--med) var(--ease), box-shadow var(--med) var(--ease);
}
.product-card:hover { transform: translate(-2px, -2px); box-shadow: 6px 7px 0 var(--lilac); }
.product-card .media {
  position: relative;
  aspect-ratio: 1;
  background: var(--petal);
  border-bottom: var(--border);
}
.product-card img { width: 100%; height: 100%; object-fit: cover; }
.product-card .sticker { position: absolute; top: 12px; left: 12px; }
.product-card .body { padding: 14px 14px 16px; display: grid; gap: 4px; }
.product-card h3 { font-size: 22px; }
.product-card .meta { color: var(--plum); font-weight: 700; font-size: 14px; }
```

Card contents, in order: photo, sticker if needed (New, Custom, Last one), name in Fraunces, a meta line (“wool blend · made to order”), price. The whole card is the link. No tiny “quick add” on the photo; adding happens on the product page so size and color are chosen on purpose.

### Product detail

Two columns, photo left, buy box right. The buy box is a card that stays in view on desktop (`position: sticky; top: 96px`).

Left:

- Main photo in a bordered frame, petal backdrop if the photo has whitespace.
- Thumbnail row: 72px squares, 2px border, the active one gets a butter shadow.

Right:

- Eyebrow category.
- H1 product name.
- Price in Fraunces, and a hand line under it (“stitched when you order” or “ready to ship”).
- Short description, 2–4 lines.
- Color swatches as 36px circles with a 2px ink border. Selected swatch gets `box-shadow: 3px 3px 0 var(--lilac)` and a 3px gap ring.
- Size as pills, same component as shop filters.
- Quantity stepper.
- Primary button “Add to bag”. If the piece is custom, the button reads “Start a custom order” and opens the note field first.
- A stitched reassurance row: fiber, care, ships in.
- Accordions for Story, Measurements, Care. Accordion headers are full width, border-bottom only, Fraunces 22px, a plus icon in a small circle.

```css
.pdp {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: var(--space-7);
  align-items: start;
}
.buybox { position: sticky; top: calc(var(--header-h) + 16px); }
.swatches { display: flex; gap: 10px; }
.swatch {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid var(--ink);
  cursor: pointer;
  background: var(--swatch, var(--lilac));
}
.swatch[aria-checked="true"] { box-shadow: 3px 3px 0 var(--lilac); outline: 2px solid var(--paper); }
@media (max-width: 800px) {
  .pdp { grid-template-columns: 1fr; }
  .buybox { position: static; }
}
```

Related pieces: a row of three product cards under a scallop, titled “Pairs well on the sofa” or “More from this yarn”.

### Contact

Two columns.

- Left: a short invitation, then three stitched mini-cards — email, studio hours, custom orders. A flower doodle in the corner of the column.
- Right: the form card. Fields: name, email, topic (order, custom, wholesale, hello), message. Button “Send the note”. Success replaces the form with a butter card: “Got it. We’ll write back within two days.”

### Cart

The cart is a page, not only a drawer. A small drawer can preview the bag from the header; the page is where people edit.

- Line items as rows inside one card. Each row: 96px photo with border, name, variant (“lilac · medium”), price, quantity stepper, remove as a text button in `--danger`.
- Summary card on the right, sticky: subtotal, shipping note (“calculated at checkout”), a hand-written “gift wrap +$6” checkbox styled as a butter row, primary “Checkout”.
- Empty bag: flower, “Your bag is waiting for something soft.”, button to the shop.

```css
.cart-layout {
  display: grid;
  grid-template-columns: 1.4fr 0.7fr;
  gap: var(--space-5);
  align-items: start;
}
.line {
  display: grid;
  grid-template-columns: 96px 1fr auto;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 2px dashed var(--lilac);
}
.line img {
  width: 96px;
  height: 96px;
  object-fit: cover;
  border: var(--border);
  border-radius: 12px;
}
@media (max-width: 800px) {
  .cart-layout { grid-template-columns: 1fr; }
}
```

### Checkout

A calm, single main column (`--content-narrow` for the form) with the summary beside it on desktop. Three numbered steps shown as pills, the current step filled ink:

1. Details — email, name, phone.
2. Shipping — address, method as two selectable cards (ship, local pickup).
3. Payment — card fields provided by the processor, wrapped in the same `.field` look. Order note textarea (“anything we should know about the color?”).

Selectable cards:

```css
.choice {
  display: block;
  text-align: left;
  width: 100%;
  background: var(--paper);
  border: var(--border);
  border-radius: var(--radius);
  padding: 14px 16px;
  box-shadow: var(--shadow-press);
  cursor: pointer;
  font: inherit;
  color: inherit;
}
.choice[aria-checked="true"] {
  background: var(--petal);
  box-shadow: var(--shadow-ink);
}
```

Order confirmation is its own view, not a modal. Big Fraunces “It’s in our hands.”, order number in a butter sticker, a short “what happens next” list of three steps, and a link back to the shop.

Trust row under the pay button, in 13px plum type: made to order window, easy note if something arrives not as described, secure payment. No row of gray payment logos larger than 28px tall.

---

## 10. Admin

The admin is the same materials, used more quietly. Cream canvas, ink borders, lilac shadows. Fewer doodles: one flower next to the wordmark, none inside tables. Density goes up; personality stays.

Shell:

- Left rail, 240px, `--ink` background, links in `--lilac`, active link a butter pill with ink text.
- Top bar on cream: page title in Fraunces, a search field, the shop name.
- Content padding 28px.

```css
.admin {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
  background: var(--cream);
}
.rail {
  background: var(--ink);
  color: var(--line);
  padding: 22px 16px;
}
.rail a {
  display: block;
  color: var(--lilac);
  text-decoration: none;
  font-weight: 800;
  padding: 10px 12px;
  border-radius: var(--radius-pill);
}
.rail a[aria-current="page"] {
  background: var(--butter);
  color: var(--ink);
}
.admin-main { padding: 28px; }
.stat {
  background: var(--paper);
  border: var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 16px 18px;
}
.stat b {
  display: block;
  font-family: var(--font-display);
  font-size: 36px;
  line-height: 1;
}
```

Rail items, in order: Dashboard, Products, Orders, Customers, Reports. The owner signs in through the React admin and uses these five pages. Dashboard holds the charts. Reports is the orders report, on its own route.

Tables live inside a `.card` with the shadow. Header row is petal, not gray. Row hover is a blush wash. Status is a sticker, not a tiny colored dot:

| Status | Sticker |
| --- | --- |
| Pending | butter |
| Stitching | lilac |
| Shipped | blush, ink text |
| Delivered | paper, success-colored text |
| Cancelled | rose |

Money and dates align right, in tabular nums:

```css
.table { width: 100%; border-collapse: collapse; }
.table th {
  text-align: left;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 10px 12px;
  background: var(--petal);
  border-bottom: var(--border);
}
.table td {
  padding: 12px;
  border-bottom: 2px dashed var(--lilac);
  font-variant-numeric: tabular-nums;
}
.table tr:hover td { background: var(--blush); }
```

Product editor: left column the fields (name, price, category, yarn, status, description), right column the photo dropzone. The dropzone is dashed plum on petal, with the flower doodle and “drop a photo of the piece”.

Dashboard: four stat cards (revenue this month, orders this month, open orders, customers), then two chart cards on the same paper surface — revenue by day as flat ink bars, orders by status as flat bars in the sticker colors. Guide lines are lilac. No gradient series and no gray chart chrome. Latest orders sit beside the charts.

The orders report is a separate page, not a third chart on the dashboard: date range, totals, a revenue chart for that range, the matching orders, and a CSV download.

Admin on a phone: the rail becomes a top bar. Tables scroll sideways inside the card; do not squash columns into unreadable stacks of labels unless the row is an order card under 700px. Prefer a card-per-order list on small screens.

---

## 11. Motion

Short, physical, no bounce that overshoots like a cartoon.

- Hover lift: 2px up-left, shadow grows by 2px, 220ms, `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Press: 2px down-right, shadow shrinks, 140ms.
- Page sections: optional fade-up of 8px on first view. Once. Do not stagger more than three cards.
- Cart count: a 160ms scale from 0.8 to 1 when the number changes.
- Scallops, grids, and polaroid rotation do not animate on scroll.
- `prefers-reduced-motion`: remove transforms. Keep color and border state changes.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
  }
}
```

---

## 12. Responsive rules

| Width | Behavior |
| --- | --- |
| ≥ 1100px | Full grids, sticky buy box and cart summary |
| 800–1099px | Hero and PDP stack. Shop stays 2 columns |
| ≤ 800px | Header nav moves into a menu button. Cart summary sits under the lines. Buttons in the buy box and checkout are full width |
| ≤ 640px | Shop is 1 column. Section padding drops from 72px to 40px. H1 uses the clamp floor |

Touch targets stay at least 44px. The quantity stepper and swatches already do.

Photos: object-fit cover, consistent aspect ratios (1:1 on the shop grid, 4:5 on the hero and PDP). Never stretch a skein or a garment.

---

## 13. Voice on the interface

Write like a person at the table, specific and warm.

- Buttons: “Add to bag”, “Start a custom order”, “Send the note”, “Checkout”.
- Empty states name the object: bag, basket, inbox. They do not say “Oops!” or “Uh oh!”.
- Handmade timing is honest: “Ships in 5–10 days” beats “fast shipping”.
- Errors tell the next step: “Add an email so we can send tracking.”

The hand font never carries instructions. If the reader must act on it, it is Nunito.

---

## 14. How this maps onto the stack

Use one token file in the React app, imported once at the root. Component class names in this document can be CSS modules or a single `heliant.css`. Do not restyle third-party payment fields beyond the outer wrapper; keep the wrapper as `.field` so the page still looks like Heliant.

The shop owner uses the React admin in section 10, on the same API, guarded by Django auth. Customers do not see that layout. Django’s own admin is not the shop panel.

PostgreSQL holds products, variants, orders, and stitch-list emails. Nothing in this document depends on a column shape. Railway serves the Django app and the built React storefront; both read the same CSS tokens only on the frontend. Email and PDF receipts, if added later, reuse `--ink`, `--cream`, `--violet`, and Fraunces via a small HTML email, not a second palette.

Asset notes:

- Export the logo as SVG. Recolor nothing; place it on cream or ink only.
- Product photos sit on a plain backdrop (cream, petal, or soft daylight). The UI frame is doing the decorating.
- Favicon: the flower linework on an ink rounded square, 2px of cream padding inside the tile.

---

## 15. CSS starter

Drop-in base. Components above assume this file is loaded.

```css
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@500;600&family=Fraunces:opsz,wght@9..144,520;9..144,640;9..144,700&family=Nunito:wght@400;600;700;800&display=swap");

:root {
  --ink: #3c145f;
  --plum: #6e3d93;
  --violet: #a56cc4;
  --lilac: #d7b6ea;
  --petal: #f4e7fa;
  --blush: #f8e6f0;
  --cream: #fff8f3;
  --paper: #fffcfa;
  --butter: #f6e3a1;
  --peach: #f8d3b8;
  --sage: #dce8cc;
  --sky: #d9e0f8;
  --rose: #e7a3c4;
  --line: #ffffff;
  --success: #3e7a5a;
  --warning: #9a6420;
  --danger: #9b3d55;
  --border: 2px solid var(--ink);
  --radius-sm: 12px;
  --radius: 18px;
  --radius-lg: 28px;
  --radius-pill: 999px;
  --shadow: 4px 5px 0 var(--lilac);
  --shadow-ink: 4px 5px 0 var(--ink);
  --shadow-press: 2px 2px 0 var(--lilac);
  --font-display: "Fraunces", Palatino, serif;
  --font-body: "Nunito", "Segoe UI", sans-serif;
  --font-hand: "Caveat", cursive;
  --content: 1120px;
  --header-h: 76px;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  --fast: 140ms;
  --med: 220ms;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.6;
  font-weight: 500;
  color: var(--ink);
  background-color: var(--cream);
  background-image:
    linear-gradient(to right, rgba(165, 108, 196, 0.13) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(165, 108, 196, 0.13) 1px, transparent 1px);
  background-size: 28px 28px;
}
img { max-width: 100%; display: block; }
button, input, textarea, select { font: inherit; color: inherit; }
h1, h2, h3 { font-family: var(--font-display); font-weight: 640; letter-spacing: -0.02em; line-height: 1.08; margin: 0 0 12px; }
p { margin: 0 0 12px; }
:focus-visible { outline: 3px solid var(--violet); outline-offset: 3px; }
```

---

## 16. Checklist before a page is “done”

- Background is cream grid, not flat white and not logo-purple.
- Every clickable card and button has a 2px ink border and an offset shadow.
- Corners are at least 12px, except swatches (circles) and the scallop.
- One Caveat aside at most per section.
- Prices and product names use Fraunces.
- Status and promo marks are stickers, slightly rotated.
- A photo is never cropped by a hover animation.
- Text on butter, lilac, blush, and rose is ink. Text on ink is white.
- The same tokens are used in the admin rail, tables, and the storefront.
