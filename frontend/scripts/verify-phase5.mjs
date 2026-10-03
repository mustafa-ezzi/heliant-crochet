import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  headless: true,
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

function fail(message) {
  throw new Error(message);
}

await page.setViewport({ width: 1280, height: 900 });
await page.goto("http://127.0.0.1:5173/checkout", { waitUntil: "networkidle2" });
if (!page.url().endsWith("/cart")) fail(`empty checkout stayed on ${page.url()}`);
const empty = await page.$eval("h1", (node) => node.textContent);
if (empty !== "Your bag is waiting for something soft.") fail(empty);

await page.goto("http://127.0.0.1:5173/shop/daisy-day-bag", { waitUntil: "networkidle2" });
await page.click('.swatch[aria-label="Rose"]');
await page.evaluate(() => {
  [...document.querySelectorAll(".pill")].find((node) => node.textContent === "Day").click();
});
await page.click('button[aria-label="More"]');
await page.click("button.buy-btn");
await page.click('a[href="/cart"]');
await page.waitForSelector(".bag-line");

const first = await page.evaluate(() => ({
  variant: document.querySelector(".bag-line p")?.textContent,
  price: document.querySelector(".bag-price")?.textContent,
  badge: document.querySelector(".cart-count")?.textContent,
}));
if (first.variant !== "Rose · Day" || first.price !== "$168" || first.badge !== "2") fail(JSON.stringify(first));

await page.click('button[aria-label="More Daisy day bag"]');
const bumped = await page.$eval(".bag-price", (node) => node.textContent);
const badge3 = await page.$eval(".cart-count", (node) => node.textContent);
if (bumped !== "$252" || badge3 !== "3") fail(`${bumped} ${badge3}`);
await page.click('button[aria-label="Fewer Daisy day bag"]');

await page.click(".gift-row input");
const subtotal = await page.$eval(".sum-row strong", (node) => node.textContent);
if (subtotal !== "$174") fail(subtotal);

await page.setViewport({ width: 390, height: 844 });
const cartOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
await page.screenshot({ path: "scripts/phase5-cart.png", fullPage: true });
if (cartOverflow > 1) fail(`cart overflow ${cartOverflow}`);

await page.setViewport({ width: 1280, height: 900 });
await page.click(".remove-line");
const emptied = await page.$eval("h1", (node) => node.textContent);
if (emptied !== "Your bag is waiting for something soft.") fail(emptied);

await page.click('a[href="/shop"]');
await page.waitForSelector('a[href="/shop/daisy-day-bag"]');
await page.click('a[href="/shop/daisy-day-bag"]');
await page.waitForSelector('.swatch[aria-label="Rose"]');
await page.click('.swatch[aria-label="Rose"]');
await page.evaluate(() => {
  [...document.querySelectorAll(".pill")].find((node) => node.textContent === "Day").click();
});
await page.click('button[aria-label="More"]');
await page.click("button.buy-btn");
await page.click('a[href="/cart"]');
await page.waitForSelector('a[href="/checkout"]');
await page.click('a[href="/checkout"]');
await page.waitForSelector("#checkout-email");
if (!page.url().endsWith("/checkout")) fail(page.url());

await page.click('button[type="submit"]');
const blocked = await page.$$eval(".error", (nodes) => nodes.map((node) => node.textContent));
const stillDetails = await page.$eval('.step-pill[aria-current="step"]', (node) => node.textContent);
if (blocked.length < 3 || stillDetails !== "Details") fail(JSON.stringify({ blocked, stillDetails }));

await page.type("#checkout-email", "ada@example.com");
await page.type("#checkout-name", "Ada Hook");
await page.type("#checkout-phone", "555-123-4567");
await page.click('button[type="submit"]');
const onShipping = await page.$eval('.step-pill[aria-current="step"]', (node) => node.textContent);
if (onShipping !== "Shipping") fail(onShipping);

await page.click('button[type="submit"]');
const street = await page.$eval(".error", (node) => node.textContent);
if (!street.toLowerCase().includes("street")) fail(street);

await page.click('.choice[aria-checked="false"]');
await page.click('button[type="submit"]');
const onPayment = await page.$eval('.step-pill[aria-current="step"]', (node) => node.textContent);
if (onPayment !== "Payment") fail(onPayment);
const sample = await page.$eval(".sample-note", (node) => node.textContent);
if (sample !== "Sample payment. Nothing is charged.") fail(sample);

await page.click('button[type="submit"]');
const payErrors = await page.$$eval(".error", (nodes) => nodes.length);
if (payErrors < 3 || !page.url().endsWith("/checkout")) fail(`payment errors ${payErrors}`);

await page.type("#checkout-number", "4242424242424242");
await page.type("#checkout-expiry", "11/28");
await page.type("#checkout-cvc", "123");
await page.type("#checkout-note", "Keep the rose soft");
const markHeight = await page.$eval(".pay-marks span", (node) => node.getBoundingClientRect().height);
if (markHeight > 28) fail(`logo ${markHeight}`);

await page.setViewport({ width: 390, height: 844 });
const payOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
if (payOverflow > 1) fail(`checkout overflow ${payOverflow}`);
await page.screenshot({ path: "scripts/phase5-checkout.png", fullPage: true });

await page.setViewport({ width: 1280, height: 900 });
await page.click('button[type="submit"]');
await page.waitForSelector("h1");
if (!page.url().includes("/checkout/confirmation")) fail(page.url());

const receipt = await page.evaluate(() => ({
  h1: document.querySelector("h1")?.textContent,
  sample: document.querySelector(".sample-line")?.textContent,
  number: document.querySelector(".order-sticker")?.textContent,
  name: document.querySelector(".bag-line h2")?.textContent,
  variant: document.querySelector(".bag-line p")?.textContent,
  qty: [...document.querySelectorAll(".bag-line p")].map((node) => node.textContent),
  subtotal: [...document.querySelectorAll(".sum-row strong")].map((node) => node.textContent),
  note: document.querySelector(".confirm-note")?.textContent,
  shop: document.querySelector(".confirm-wrap .btn")?.textContent?.trim(),
  badge: document.querySelector(".cart-count")?.textContent,
}));
if (receipt.h1 !== "It’s in our hands.") fail(receipt.h1);
if (receipt.sample !== "Sample only. No payment was taken.") fail(receipt.sample);
if (!/^HH-\d{4}$/.test(receipt.number || "")) fail(receipt.number);
if (receipt.name !== "Daisy day bag" || receipt.variant !== "Rose · Day") fail(JSON.stringify(receipt));
if (!receipt.qty.includes("Qty 2")) fail(JSON.stringify(receipt.qty));
if (!receipt.subtotal.includes("$6") || !receipt.subtotal.includes("$174")) fail(JSON.stringify(receipt.subtotal));
if (receipt.note !== "Keep the rose soft") fail(receipt.note);
if (receipt.shop !== "Shop the latest") fail(receipt.shop);
if (receipt.badge !== "0") fail(receipt.badge);

await page.screenshot({ path: "scripts/phase5-confirm.png", fullPage: true });
await page.setViewport({ width: 390, height: 844 });
const confirmOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
if (confirmOverflow > 1) fail(`confirm overflow ${confirmOverflow}`);
if (errors.length) fail(errors.join("\n"));

console.log("phase 5 checks passed");
await browser.close();
