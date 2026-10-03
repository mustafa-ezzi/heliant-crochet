import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  headless: true,
});
const page = await browser.newPage();
page.setDefaultNavigationTimeout(90000);
page.setDefaultTimeout(90000);
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await page.setViewport({ width: 1280, height: 900 });

await page.goto("http://127.0.0.1:5173/shop", { waitUntil: "domcontentloaded" });
await page.waitForSelector(".price, .empty-card h2", { timeout: 20000 });
const shop = await page.evaluate(() => ({
  quiet: document.querySelector(".empty-card h2")?.textContent,
  prices: [...document.querySelectorAll(".price")].map((node) => node.textContent),
  count: document.querySelector(".lede")?.textContent,
}));
if (shop.quiet) throw new Error(shop.quiet);
if (!shop.prices.includes("$99") || shop.prices.includes("$84")) throw new Error(JSON.stringify(shop));
if (shop.count !== "4 pieces ready to stitch or ship") throw new Error(shop.count);

await page.goto("http://127.0.0.1:5173/shop/daisy-day-bag", { waitUntil: "domcontentloaded" });
await page.waitForSelector(".pdp-price, .empty-card h2", { timeout: 20000 });
const detail = await page.$eval(".pdp-price", (node) => node.textContent);
if (detail !== "$99") throw new Error(detail);
const swatches = await page.$$eval(".swatch", (nodes) => nodes.length);
if (swatches < 2) throw new Error(`swatches ${swatches}`);

await page.goto("http://127.0.0.1:5173/", { waitUntil: "domcontentloaded" });
await page.waitForSelector(".product-card .price", { timeout: 20000 });
const home = await page.$$eval(".product-card .price", (nodes) => nodes.map((node) => node.textContent));
if (!home.includes("$99")) throw new Error(JSON.stringify(home));

await page.goto("http://127.0.0.1:5173/shop/not-a-piece", { waitUntil: "domcontentloaded" });
await page.waitForSelector("h1", { timeout: 20000 });
const missing = await page.$eval("h1", (node) => node.textContent);
if (missing !== "This page is not on the table.") throw new Error(missing);

const quiet = await browser.newPage();
await quiet.setRequestInterception(true);
quiet.on("request", (request) => {
  if (request.url().includes("/api/v1/products")) request.abort();
  else request.continue();
});
await quiet.goto("http://127.0.0.1:5173/shop", { waitUntil: "domcontentloaded" });
await quiet.waitForSelector(".empty-card h2");
const message = await quiet.$eval(".empty-card h2", (node) => node.textContent);
if (message !== "The table is quiet for a moment. Please try again.") throw new Error(message);

if (errors.length) throw new Error(errors.join("\n"));
console.log("phase 6 checks passed");
await browser.close();
