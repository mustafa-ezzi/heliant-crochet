import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  headless: true,
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));

const slugs = [
  ["daisy-day-bag", "Daisy day bag", "$84"],
  ["petal-bucket-hat", "Petal bucket hat", "$58"],
  ["flower-patch-cushion", "Flower patch cushion", "$72"],
  ["lilac-market-tote", "Lilac market tote", "$76"],
];

await page.setViewport({ width: 1280, height: 900 });

for (const [slug, name, price] of slugs) {
  await page.goto(`http://127.0.0.1:5173/shop/${slug}`, { waitUntil: "networkidle2" });
  const info = await page.evaluate(() => ({
    h1: document.querySelector("h1")?.textContent,
    price: document.querySelector(".pdp-price")?.textContent,
    swatches: document.querySelectorAll(".swatch").length,
    sizes: document.querySelectorAll(".option-block .pill").length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    custom: document.querySelector(".buy-btn")?.textContent?.trim(),
    href: document.querySelector(".buy-btn")?.getAttribute("href"),
  }));
  if (info.h1 !== name || info.price !== price || info.swatches < 2 || info.sizes < 2 || info.overflow > 1) {
    throw new Error(`${slug} ${JSON.stringify(info)}`);
  }
  if (slug === "lilac-market-tote" && info.href !== "/custom?piece=lilac-market-tote") {
    throw new Error(`custom link ${info.href}`);
  }
}

await page.goto("http://127.0.0.1:5173/shop/missing-piece", { waitUntil: "domcontentloaded" });
const missing = await page.$eval("h1", (node) => node.textContent);
if (missing !== "This page is not on the table.") throw new Error(missing);

await page.goto("http://127.0.0.1:5173/shop/daisy-day-bag", { waitUntil: "networkidle2" });
await page.click('.swatch[aria-label="Rose"]');
await page.evaluate(() => {
  [...document.querySelectorAll(".pill")].find((node) => node.textContent === "Day").click();
});
await page.click('button[aria-label="More"]');
await page.click("button.buy-btn");
const badge = await page.$eval(".cart-count", (node) => node.textContent);
const label = await page.$eval('a[href="/cart"]', (node) => node.getAttribute("aria-label"));
if (badge !== "2" || label !== "Bag, 2 pieces") throw new Error(`${badge} ${label}`);

await page.click('a[href="/cart"]');
await page.waitForSelector(".bag-line");
const line = await page.evaluate(() => ({
  name: document.querySelector(".bag-line h2")?.textContent,
  variant: document.querySelector(".bag-line p")?.textContent,
  price: document.querySelector(".bag-price")?.textContent,
}));
if (line.name !== "Daisy day bag" || line.variant !== "Rose · Day" || line.price !== "$168") {
  throw new Error(JSON.stringify(line));
}

await page.setViewport({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:5173/shop/daisy-day-bag", { waitUntil: "domcontentloaded" });
const mobile = await page.evaluate(() => {
  const box = document.querySelector(".buybox");
  return {
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    sticky: getComputedStyle(box).position,
  };
});
if (mobile.overflow > 1 || mobile.sticky !== "static") throw new Error(JSON.stringify(mobile));

await page.setViewport({ width: 1280, height: 900 });
await page.goto("http://127.0.0.1:5173/shop/lilac-market-tote", { waitUntil: "domcontentloaded" });
await page.click('a[href="/custom?piece=lilac-market-tote"]');
await page.waitForSelector('textarea[name="want"]');
const want = await page.$eval('textarea[name="want"]', (node) => node.value);
if (want !== "Lilac market tote") throw new Error(want);
if (errors.length) throw new Error(errors.join("\n"));

console.log("phase 4 checks passed");
await browser.close();
