# Heliant — Merged specification and development phases

The brand name is **Heliant Hook**.

This is the build document. It merges two sources:

- `HELIANT_DESIGN_SYSTEM.md` — palette, component recipes, and the pages the Lovable app does not include yet (shop, product, cart, checkout, about, contact, custom, admin).
- The Lovable storefront specification — the home page as it was actually built, including exact type sizes, spacing, copy, assets, and responsive behavior.

Where the two disagree on the home page or on a shared measurement, the Lovable specification wins. Those decisions are listed in [Resolved conflicts](#resolved-conflicts). Component CSS that both documents already agree on stays in the design system; this file does not copy it again.

Stack: React storefront, Django API, PostgreSQL, Railway.

---

## Resolved conflicts

| Topic | Build with this |
| --- | --- |
| Heading letter-spacing | `0`. Do not use `-0.02em`. |
| Hero H1 | `clamp(44px, 6vw, 72px)`, Fraunces semibold |
| Section H2 | `clamp(34px, 4vw, 48px)`, Fraunces semibold |
| Newsletter H2 | `30px` |
| Footer heading | `20px` |
| Navigation | `12px`, extra-bold, uppercase, `0.12em` tracking |
| Wordmark | Fraunces `29px` bold. Letters `ant` are Violet. Mark is a `40px` ink rounded square. |
| Header | Height `76px`, cream, `z-index: 40`, content width `1120px`, side padding `20px` |
| Header icon buttons | `44px` circles. Account hides on the narrowest phones. Bag stays. |
| Menu breakpoint | Below `768px` the desktop links become a paper sheet under the header. |
| Primary button shadow | Lilac, `4px 5px 0 #D7B6EA`. Ink shadows are for butter notes, number badges, and selected checkout choices. |
| Product card body | `16px` padding. Name `22px`. Meta `14px` bold plum. Price `20px` bold Fraunces. |
| Product sticker | Butter, `11px`, rotated `-3deg` |
| Hero “New drop” sticker | Rose, `12px`, rotated `-5deg`, ink shadow |
| Studio section width | `1040px` |
| Newsletter width | `930px` |
| Page motion | Hover and press only. No fade-up, no stagger, no parallax. |
| Press and hover timing | Both use `220ms` and `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| Reduced motion | Remove animation, transitions, and smooth scrolling |
| Selection | Background `#D7B6EA`, text `#3C145F` |
| Body font file | Nunito weights `400;500;600;700;800` |
| Home copy, section order, photos, icons | The Lovable home, unchanged |

Shared rules that already match in both documents stay in force: cream `28px` graph paper, `2px` ink borders, no pure black, no blur shadows, no gradients, Caveat only for short asides, plum for supporting text, Fraunces for names and prices.

---

## Routes

Every page is its own URL. The home page may preview the shop, the studio, and the stitch list, and each of those previews links to its own route. Refreshing a URL renders that page, not the home page.

The storefront shares one layout: announcement bar, sticky header, page content, scalloped footer. The admin uses a different layout and does not show the storefront header.

### Storefront

| Route | Page | Nav item that lights up |
| --- | --- | --- |
| `/` | Home | Home |
| `/about` | About the studio | About |
| `/shop` | Shop catalog | Shop |
| `/shop/:slug` | Product detail | Shop |
| `/custom` | Custom orders | none (linked from the footer and the home steps) |
| `/contact` | Contact | Contact |
| `/cart` | Bag | bag icon |
| `/checkout` | Checkout | none |
| `/checkout/confirmation` | Order received | none |
| `/account` | Account | account icon |

### Admin

The admin is a React app in the same frontend, with its own layout and its own URLs. The shop owner signs in and uses this panel to run the store. Customers never see it. Django’s built-in admin is not part of the product.

Same color tokens, quieter chrome, ink rail. Charts use flat ink and violet fills on paper cards, with lilac guide lines and no gradients.

| Route | Page |
| --- | --- |
| `/admin/login` | Owner sign-in |
| `/admin` | Dashboard, with charts |
| `/admin/products` | Product list |
| `/admin/products/new` | Create product |
| `/admin/products/:id` | Edit product |
| `/admin/orders` | Orders |
| `/admin/orders/:id` | Order detail |
| `/admin/customers` | Customers |
| `/admin/reports` | Orders report |

### Routing rules

- Use React Router. Declare each page as a child of the storefront layout, except admin routes, which sit under the admin layout.
- Header, footer, announcement, hero CTAs, product cards, and “See the shop” use real links. They do not scroll to a section and call that navigation.
- The active nav pill (butter fill, ink border, lilac shadow) follows the matched route. `/shop/:slug` keeps Shop active.
- Checkout stays on `/checkout` while the customer moves through details, shipping, and payment. Those steps are state on one page. The confirmation screen is the separate route `/checkout/confirmation`, so a refresh does not send the customer back into the form.
- Unknown storefront URLs render a small paper empty state on the cream grid: a flower doodle, “This page is not on the table.”, and a link to `/shop`.
- Unknown admin URLs redirect to `/admin`.
- The Django API lives at `/api/v1/`. It is not a page in the storefront router.
- On Railway the React host rewrites unknown paths to `index.html`, so `/about` and `/shop/daisy-day-bag` survive a refresh.

```jsx
<Routes>
  <Route element={<StorefrontLayout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/shop" element={<ShopPage />} />
    <Route path="/shop/:slug" element={<ProductPage />} />
    <Route path="/custom" element={<CustomPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/checkout/confirmation" element={<ConfirmationPage />} />
    <Route path="/account" element={<AccountPage />} />
  </Route>
  <Route path="/admin/login" element={<AdminLogin />} />
  <Route element={<AdminLayout />}>
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="/admin/products" element={<AdminProducts />} />
    <Route path="/admin/products/new" element={<AdminProductEditor />} />
    <Route path="/admin/products/:id" element={<AdminProductEditor />} />
    <Route path="/admin/orders" element={<AdminOrders />} />
    <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
    <Route path="/admin/customers" element={<AdminCustomers />} />
    <Route path="/admin/reports" element={<AdminReports />} />
  </Route>
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

### Link map from the home page

| Control | Destination |
| --- | --- |
| Shop the latest | `/shop` |
| About the studio | `/about` |
| See the shop | `/shop` |
| Each product card | `/shop/daisy-day-bag`, `/shop/petal-bucket-hat`, `/shop/flower-patch-cushion`, `/shop/lilac-market-tote` |
| Read our story | `/about` |
| Come visit → Shop the latest | `/shop` |
| Come visit → Our studio | `/about` |
| Come visit → Custom orders | `/custom` |
| Bag button | `/cart` |
| Account button | `/account` |
| Header Home, About, Shop, Contact | `/`, `/about`, `/shop`, `/contact` |

The stitch-list form stays on the home page. It does not get its own route.

---

## Shared chrome

Used by every storefront route from the first visual phase onward.

**Announcement.** Checker of blush and petal. Copy: “Made to order in small batches · ships in 5–10 days”. `14px` extra-bold, centered, `8px` vertical padding, ink bottom border.

**Header.** Cream, `76px`, ink bottom border. Brand lockup links to `/`. Desktop nav is four links. Below `768px`, a menu button opens a paper sheet with an ink top border, `20px` padding, and a vertical list. The sheet is light. Account and bag are `44px` paper circles. The bag badge is rose, `20px`, ink border.

**Footer.** Scalloped ink top, three columns (`1.2fr 0.8fr 1fr`) collapsing to one column on small screens. Column one is the lockup plus “Soft things for homes, people, and thoughtful gifts. Handmade in small batches.” Column two is “Come visit” and the three links above. Column three is the Caveat thank-you and two `40px` white-outline circles. Copyright: “© 2026 Heliant. Stitched with care.”

**Document.** Title pattern `Heliant — {page}`. Home title is exactly `Heliant — Handmade crochet, stitched slowly`. Home description is exactly `One-of-a-kind crochet bags, home pieces, and gifts made slowly in small batches.`

Icons are Lucide, stroke only: `UserRound`, `ShoppingBag`, `Menu`, `X`, `Sparkles`, `Heart`, `Gift`, `PackageCheck`. Plum on light feature surfaces, ink inside header controls, white inside footer circles.

---

## Page contracts

### `/` Home

Rebuild the Lovable home in this order. Do not add, remove, or restyle sections.

1. Announcement
2. Sticky header
3. Hero, text left and image right, stacked on small screens
4. Scallop into the blush feature band
5. Three feature pills
6. Four-product shop preview on paper
7. Three custom-order steps on the checker
8. Studio story on petal
9. Stitch-list signup on blush
10. Scalloped footer

Hero copy stays exact: eyebrow “Handmade crochet”, headline “Soft things,” / “stitched slowly.” with the second line in violet, body “Small-batch crochet for bright homes and everyday adventures. Each piece is shaped by hand, one loop at a time.”, handwritten “made by hand, kept for years ♡”.

Hero frame: max width `510px`, paper, `22px` radius, `12px` padding, image `4:5` with `14px` inner radius. Rose “New drop” sticker, plum flower doodle rotated `12deg` at the upper right, butter note “each piece is one of a kind” (`175px` max, Caveat `24px`, rotated `2deg`).

Feature pills, in order: “Soft, thoughtful fibers”, “Made just for you”, “Ready to give”, with Sparkles, Heart, and Gift.

Shop preview heading: Caveat “fresh from the hook”, H2 “On the table this week”, link “See the shop →”. Four cards:

| Slug | Name | Meta | Price | Sticker |
| --- | --- | --- | --- | --- |
| `daisy-day-bag` | Daisy day bag | cotton blend · one of a kind | $84 | New drop |
| `petal-bucket-hat` | Petal bucket hat | soft cotton · made to order | $58 | Made to order |
| `flower-patch-cushion` | Flower patch cushion | wool blend · ready to ship | $72 | Last one |
| `lilac-market-tote` | Lilac market tote | recycled cotton · custom | $76 | Custom |

Photos: `heliant-hero-bag.jpg` (hero and first card), `crochet-bucket-hat.jpg`, `crochet-cushion.jpg`, `crochet-studio.jpg`. Hero image loads immediately. The others lazy-load. Photography stays warm daylight, tactile yarn, cream or quiet studio backgrounds, no embedded text.

Steps: “Choose your piece”, “Make it yours”, “We stitch & send”, numbered lilac badges rotated `-4deg`.

Studio: polaroid rotated `-1.5deg`, caption “a sunny afternoon at the table”, story surface eyebrow “The Heliant studio”, heading “A small table, a lot of yarn.”, paper button “Read our story”.

Stitch list: “Join the stitch list”, placeholder `you@example.com`, button “Keep me posted”. Until the API phase, the form prevents a page reload and does not pretend the address was saved.

Check the home page at `1280 × 1800` and `390 × 844`. At `390px` there is no horizontal overflow.

### `/about` About

A full page, not the home studio block repeated.

- Page hero. Eyebrow “The Heliant studio”. H1 “A small table, a lot of yarn.” One sentence of welcome.
- Two columns at desktop, stacked below `768px`. Left: the studio polaroid, same frame rules as home, max width `400px`. Right: the studio story in a paper surface, `22px` radius, measure kept near `65ch`.
- “What we make”: four paper cards — Wear, Home, Baby, Custom — each with a stroke flower and one line. Custom links to `/custom`. Wear and Home link to `/shop` with that category selected.
- A stitched card (dashed plum border, paper, lilac shadow) for materials and care: yarn, hand washing, and the note that batch colors vary.
- Ink closing band, white Fraunces line, butter pill “Shop the latest” linking to `/shop`.

### `/shop` Shop

- Page hero. Eyebrow “The shop”. H1 “On the table”. A count line that reads from the catalog, for example “4 pieces ready to stitch or ship”.
- Filter pills: All, Wear, Home, Baby, Custom. The active pill is butter. Sort is a paper select on the right: Featured, Price, Newest.
- Grid of the same product card used on the home page. Three columns on a wide desktop, two on tablet, one on a phone. Gap `24px`.
- The whole card links to `/shop/:slug`. There is no add-to-bag control on the card.
- An empty filter shows the flower doodle, “Nothing in this basket yet.”, and a control that returns to All.
- Seed categories: bags and the hat are Wear, the cushion is Home, the tote is Custom.

### `/shop/:slug` Product

Two columns, photo left, buy box right. The buy box is sticky at `top: 92px` on desktop and static below `800px`.

- Framed `4:5` photo, petal backdrop, thumbnail row of `72px` squares. The active thumbnail uses the butter treatment.
- Eyebrow category, Fraunces name, Fraunces price, one Caveat line (“stitched when you order” or “ready to ship”).
- Short description.
- Color swatches: `36px` circles, `2px` ink border. The selected swatch gets `box-shadow: 3px 3px 0 #D7B6EA`.
- Size pills, same shape as the shop filters.
- Quantity stepper.
- Ink pill “Add to bag”. A custom piece instead shows “Start a custom order”, which links to `/custom` with the product name carried in the query, `?piece=lilac-market-tote`.
- Stitched reassurance row: fiber, care, ships in 5–10 days.
- Accordions: Story, Measurements, Care. Headers are Fraunces `22px`.
- Related row of up to three product cards. Heading “More from this yarn”.

A missing slug uses the storefront not-found state.

### `/custom` Custom orders

- Page hero. Eyebrow “Custom, without the fuss”. H1 “Made for your corner”.
- The same three step cards as the home page.
- A paper form: name, email, what they want, colors, size or measurements, timing, and a photo note. Button “Send the request”.
- Success replaces the form with a butter card: “Got it. We’ll write back within two days.”

### `/contact` Contact

- Two columns, stacked on small screens.
- Left: a short invitation and three stitched mini-cards — email, studio hours, and a card that links to `/custom`.
- Right: paper form. Fields: name, email, topic (order, custom, wholesale, hello), message. Button “Send the note”.
- Success copy: “Got it. We’ll write back within two days.”

### `/cart` Cart

This is a page. The header bag links here. There is no second cart experience to maintain.

- Filled state: line rows inside one paper card. Each row has a `96px` bordered photo, name, variant (“lilac · medium”), price, quantity stepper, and a remove control in `#9B3D55`.
- Summary card: subtotal, the line “Shipping is calculated at checkout”, a butter gift-wrap row at `+$6`, and an ink pill “Checkout” linking to `/checkout`.
- Empty state: flower doodle, “Your bag is waiting for something soft.”, button to `/shop`.
- Below `800px` the summary sits under the lines, and the checkout button is full width.

### `/checkout` Checkout

Narrow form column beside a summary on desktop, stacked on small screens. Three pills show the step: Details, Shipping, Payment. The current pill is ink with white type.

1. Details — email, name, phone.
2. Shipping — address, then two choice cards: ship, or local pickup. The selected card uses a petal fill and an ink shadow.
3. Payment — the processor’s fields inside the Heliant field wrapper, plus an order note (“anything we should know about the color?”).

The pay button reads “Place the order”. Under it, `13px` plum type states the 5–10 day window. Payment logos stay at or under `28px` tall.

Until the payments phase, “Place the order” stores the draft and moves to the confirmation route with sample data, clearly marked so it is not confused with a paid order.

### `/checkout/confirmation` Confirmation

Its own page. Fraunces “It’s in our hands.” Order number on a butter sticker. Three short steps for what happens next. Link back to `/shop`.

### `/account` Account

Header control destination.

- Signed out: paper card with email and password, ink button “Come in”, and a quiet link to create an account.
- Signed in: name, email, and a list of that customer’s orders. Each order links nowhere public except its own rows inside this page (status sticker, pieces, total).
- Early phases may render the signed-out card as a static layout. The form starts working in the account phase.

### Admin pages

Built in React, reached only after the owner signs in at `/admin/login`. A signed-out visit to any other `/admin` URL returns to that login. A customer session is not an owner session.

Ink rail, `240px`. Rail links, in order: Dashboard, Products, Orders, Customers, Reports. The active link is a butter pill with ink text. Cream main area, `28px` padding. On a phone the rail becomes a top bar. Tables use tabular numbers. Under `700px`, orders render as one card per order.

**`/admin` Dashboard.** Four stat cards: revenue this month, orders this month, open orders, customers. Under them, two paper chart cards:

- Revenue for the last 30 days, one ink bar per day.
- Orders by status, a row of flat bars colored with the status stickers below.

Beside or under the charts: the latest five orders, each linking to `/admin/orders/:id`, and a top-pieces list. A small paper card on this page edits the announcement line and the gift-wrap amount. Saving it updates the storefront announcement.

**`/admin/products`.** Table of photo, name, price, category, and status, with Edit and Delete on each row, plus an ink pill “New piece” to `/admin/products/new`. Delete asks for confirmation in a paper dialog. A piece that has never been ordered is removed. A piece that appears on a past order is hidden from the shop and kept so those orders still show the name, photo, and price.

**Create and edit.** `/admin/products/new` and `/admin/products/:id` share one form. Fields: name, price, category, yarn, status, description, variants (color, size, stock or made-to-order). The photo dropzone is dashed plum on petal: “drop a photo of the piece”. Save returns to the list. The public page `/shop/:slug` reflects the save.

**`/admin/orders`.** Filterable table: order number, customer, date, total, status sticker. Pending is butter, Stitching is lilac, Shipped is blush, Delivered is paper with success-colored text, Cancelled is rose. A row opens `/admin/orders/:id`, where the owner can change status and read the lines, address, and gift-wrap choice.

**`/admin/customers`.** One row per customer: name, email, orders count, amount spent, last order. Opening a row shows that person’s orders. Under the table, two shorter lists the owner still needs: custom requests, and stitch-list signups.

**`/admin/reports` Orders report.** Its own route, not a chart on the dashboard. Controls: this week, this month, or a custom date range, plus a status filter. The page then shows:

- Totals for the range: orders, revenue, average order, pieces sold.
- A revenue-by-day chart for that range.
- A table of every matching order.
- A “Download CSV” control for that same set.

Empty range copy: “No orders in these days.”

---

## App shape

```text
heliant/
  frontend/                 Vite, React, React Router
    src/routes/             one folder per route
    src/components/         header, footer, product card, buttons
    src/styles/heliant.css  tokens and shared rules
    public/images/          the four Heliant photos
  backend/                  Django
    config/                 settings, urls, wsgi
    shop/                   products, cart, orders
    studio/                 contact, custom requests, stitch list
```

The frontend owns every URL in the route table, including the admin. Django owns `/api/v1/` and the database. The shop owner uses the React admin only.

Seed products are the four home-page pieces, with the slugs in the shop table. Prices stay in cents in the database (`8400` for $84) and render as dollars in Fraunces.

---

## Phases

Each phase ends with routes that can be opened directly. A later phase does not redraw a finished page unless the data shape requires a new field.

### Phase 1 — Shell and routes

**Goal.** A React app whose URL bar already knows every storefront route, wearing the Heliant canvas.

Build:

- Vite + React + React Router, with the route tree in this document.
- `heliant.css` tokens, fonts, cream graph paper, selection color, focus ring, and the reduced-motion rule.
- `StorefrontLayout` with announcement, header, footer, and an outlet.
- Each route renders its name in a Fraunces heading on the cream grid, using the real header. Home’s nav pill is butter. About, Shop, and Contact light their own pills.
- Mobile paper menu opens and closes. Bag shows a static count of `0` and links to `/cart`.
- Document title updates per route.

Done when `/`, `/about`, `/shop`, `/shop/daisy-day-bag`, `/custom`, `/contact`, `/cart`, `/checkout`, `/checkout/confirmation`, and `/account` each render the shared chrome and a distinct heading, at desktop and at `390px`, with no horizontal overflow.

### Phase 2 — Home, matched to Lovable

**Goal.** `/` is the Lovable home, and every outbound control lands on a real route.

Build the ten home regions and the four photos. Wire the link map. The stitch-list form prevents reload and shows a quiet inline line, “We’ll start saving these in a later phase.”, so the control feels honest.

Done when the home checklist at the end of this file passes at `1280 × 1800` and `390 × 844`, and Shop, About, a product card, Custom, and the bag each open a different URL.

### Phase 3 — About, shop, custom, and contact

**Goal.** The four content routes look like Heliant, still using local data.

Build the page contracts for `/about`, `/shop`, `/custom`, and `/contact`. Put the four products in a local catalog module that both `/` and `/shop` read, so names, prices, and slugs cannot drift. Shop filters work on that local list. Contact and custom forms validate in the browser and show the butter success card without a server.

Done when each route is visually complete, the shop filter for Home shows only the cushion, Custom shows only the tote, and an empty category shows the empty state.

### Phase 4 — Product detail

**Goal.** `/shop/:slug` is where a piece is chosen and, locally, added to the bag.

Build the product contract. Adding to the bag writes to React state (context) held above the router: slug, name, image, options, quantity, unit price. The header count is that quantity sum. Refresh may clear the bag in this phase.

“Start a custom order” goes to `/custom?piece=lilac-market-tote` and prefills the piece name.

Done when each of the four slugs renders its own photo, price, and options, a missing slug shows the not-found state, and adding the daisy bag changes the badge and is visible on `/cart` as a static line.

### Phase 5 — Cart and checkout screens

**Goal.** The buying path works in the browser from product to confirmation, still without a server.

Build `/cart` editing (quantity, remove, gift wrap). `/checkout` walks the three steps, keeps the summary in sync, and blocks “Place the order” until the required fields are valid. Confirmation reads the order number and lines from location state and offers a path back to `/shop`. Empty `/cart` shows the empty state. Opening `/checkout` with an empty bag returns to `/cart`.

Done when a person can open a product, add a size and color, change quantity in the bag, add gift wrap, pass all three checkout steps, and land on `/checkout/confirmation` with the right pieces listed.

### Phase 6 — Django, PostgreSQL, and the catalog API

**Goal.** The four products, and any product added later, come from Postgres.

Build the Django project, PostgreSQL locally, and models for category, product, product image, and variant. Expose read endpoints:

- `GET /api/v1/products`
- `GET /api/v1/products/:slug`

Load the four seed pieces and their photos. Point the React catalog at the API. Home, shop, and product pages render from that response. While the API is down, the shop shows a paper message: “The table is quiet for a moment. Please try again.”

Done when editing a price in Postgres changes `/shop` and the matching product route without a frontend code change.

### Phase 7 — Orders, contact, custom requests, and the stitch list

**Goal.** The forms and the bag persist.

Models: order, order line, contact message, custom request, stitch-list signup. Endpoints create them. Cart contents are still held in the browser until checkout, then `POST /api/v1/orders` stores the order with status `pending`. Gift wrap is a boolean and a cents amount. Contact, custom, and the home stitch list post to the API and then show the success copy already specified.

Confirmation reads the saved order by id: `/checkout/confirmation?order=`. A bad id shows a calm paper message and a link to `/contact`.

Done when a placed order, a contact note, a custom request, and a stitch-list email each exist as rows and survive a browser refresh of the confirmation page.

### Phase 8 — Account

**Goal.** `/account` signs a customer in and lists their orders.

Django auth with session cookies for the storefront, issued only over the API. The signed-out and signed-in layouts from the account contract become real. An order placed while signed in is attached to that customer. Staff users are flagged for the next phase.

Done when a customer can create an account, sign in, place an order, leave, come back, and see that order on `/account`.

### Phase 9 — React admin

**Goal.** The shop owner signs in and runs the store from the React admin: dashboard charts, products, orders, customers, and the orders report.

Build `/admin/login`, `AdminLayout`, and every admin route in the table above. The owner is a Django user with the staff flag. Anyone else who opens `/admin` is sent to `/admin/login`. The storefront header is not on these pages.

Endpoints the panel needs:

- `GET /api/v1/admin/dashboard` — stat cards, 30-day revenue series, orders by status, latest orders, top pieces.
- Product list, create, update, and delete.
- Order list, order detail, and status update.
- Customer list, with each customer’s orders, plus custom requests and stitch-list rows.
- `GET /api/v1/admin/reports?from=&to=&status=` — totals, daily revenue, and the order rows used by both the table and the CSV.

Charts are React components on paper cards. Bars are flat ink or violet. Guide lines are lilac. Axes and labels are Nunito. Numbers on the cards are Fraunces.

Done when the owner can sign in, read both dashboard charts, create a fifth product and see it on `/shop`, edit it, delete or hide it, move an order from pending to stitching, open a customer, and download a CSV from `/admin/reports` for a chosen date range.

### Phase 10 — Payment, mail, and Railway

**Goal.** A real charge, a real note in the inbox, and a public URL.

- Use Stripe for card payment. The Payment step stays inside the Heliant field wrapper. An order becomes paid only after Stripe confirms it. A declined card stays on `/checkout` with dusty danger text that tells the customer what to do next.
- Send the stitch-list note and the order confirmation through Django email.
- Deploy two Railway services (React, Django) and a PostgreSQL plugin. Set the API base URL and the Stripe keys in the service environment. Configure the SPA fallback so deep links work.
- Production check: home at desktop and `390px`, a paid test order, an admin status change, and a refresh on `/about` and `/shop/:slug`.

Done when a test card completes `/checkout`, the confirmation route shows the paid order, and the staff overview counts it.

---

## Home recreation checklist

`/` matches only when all of these are true:

- Cream background with a faint `28px` violet graph.
- Major borders are `2px` ink. No pure black.
- Primary shadows are hard-offset lilac with no blur.
- Cards are at least `18px` radius. Hero frame and story surface are `22px`. Buttons and feature rows are pills.
- Fraunces for headings, product names, and prices. Nunito for body and controls. Caveat only in short asides.
- Hero is text-left / image-right on desktop and stacked on mobile, with paper frame, rose sticker, doodle, and butter note.
- Three feature pills, four product cards, three numbered steps.
- Studio story uses a rotated polaroid and a separate paper surface.
- Newsletter sits in a blush band. Footer is ink, scalloped, three columns on desktop.
- Hover moves a control `2px` up-left. Press moves it `2px` down-right.
- Below `768px` the menu is a light paper sheet.
- No horizontal overflow at `390px`.
- Photography stays warm, tactile, and naturally lit.
- Shop, About, Contact, Custom, Cart, and each product are separate routes, and the home links open them.

## Other pages checklist

A non-home route is done when:

- It uses the storefront layout, except `/admin/*`, which uses the admin layout.
- Its URL loads directly and after refresh.
- The header pill matches the route table.
- It uses the resolved type sizes and the same tokens as home.
- Empty, missing, and success states use the copy in the page contract.
- It does not introduce a second palette, a blurred shadow, or a dark navigation drawer.
