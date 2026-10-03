import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  headless: true,
});
const page = await browser.newPage();
const failures = [];
const check = (name, ok, detail = "") => {
  if (!ok) failures.push(`${name}${detail ? `: ${detail}` : ""}`);
};

async function overflow(width, path) {
  await page.setViewport({ width, height: 900 });
  await page.goto(`http://127.0.0.1:5173${path}`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("h1");
  const data = await page.evaluate(() => ({
    h1: document.querySelector("h1")?.textContent?.trim(),
    brand: document.querySelector(".wordmark")?.textContent?.replace(/\s+/g, " ").trim(),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    title: document.title,
  }));
  check(`${width} ${path} overflow`, data.overflow <= 1, String(data.overflow));
  check(`${width} ${path} brand`, data.brand === "heliant hook", data.brand);
  check(`${width} ${path} title`, data.title.startsWith("Heliant Hook"), data.title);
  return data;
}

await overflow(1280, "/about");
await page.screenshot({ path: "scripts/about-1280.png", fullPage: true });
await overflow(390, "/about");
await overflow(1280, "/shop");
const allNames = await page.$$eval(".product-card h3", (nodes) => nodes.map((node) => node.textContent.trim()));
check("shop all", allNames.length === 4, allNames.join(", "));
await page.click(".filters button:nth-child(3)");
await page.waitForFunction(() => location.search.includes("category=Home"));
const homeNames = await page.$$eval(".product-card h3", (nodes) => nodes.map((node) => node.textContent.trim()));
check("home filter", homeNames.length === 1 && homeNames[0] === "Flower patch cushion", homeNames.join(", "));
await page.click(".filters button:nth-child(5)");
await page.waitForFunction(() => location.search.includes("category=Custom"));
const customNames = await page.$$eval(".product-card h3", (nodes) => nodes.map((node) => node.textContent.trim()));
check("custom filter", customNames.length === 1 && customNames[0] === "Lilac market tote", customNames.join(", "));
await page.click(".filters button:nth-child(4)");
await page.waitForSelector(".shop-empty");
const empty = await page.$eval(".shop-empty h2", (node) => node.textContent.trim());
check("empty", empty === "Nothing in this basket yet.", empty);
await page.click(".shop-empty .btn");
await page.waitForFunction(() => !location.search.includes("category"));
const restored = await page.$$eval(".product-card", (nodes) => nodes.length);
check("restore all", restored === 4, String(restored));

await page.select(".sort-field select", "price");
const priced = await page.$$eval(".product-card .price", (nodes) => nodes.map((node) => node.textContent.trim()));
check("price sort", priced.join(",") === "$58,$72,$76,$84", priced.join(","));

await overflow(390, "/shop");
await page.screenshot({ path: "scripts/shop-390.png", fullPage: true });

await overflow(1280, "/contact");
await page.click(".paper-form button");
const contactErrors = await page.$$eval(".error", (nodes) => nodes.map((node) => node.textContent.trim()));
check("contact errors", contactErrors.length === 3, contactErrors.join(" | "));
await page.type("#contact-name", "Ada");
await page.type("#contact-email", "ada@example.com");
await page.type("#contact-message", "Hello from the table.");
await page.click(".paper-form button");
await page.waitForSelector(".success-card");
const contactSuccess = await page.$eval(".success-card", (node) => node.textContent.replace(/\s+/g, " ").trim());
check("contact success", contactSuccess.includes("write back within two days"), contactSuccess);
await page.screenshot({ path: "scripts/contact-1280.png", fullPage: true });

await overflow(1280, "/custom?piece=lilac-market-tote");
const prefilled = await page.$eval("#custom-want", (node) => node.value);
check("prefill", prefilled === "Lilac market tote", prefilled);
await page.click(".paper-form button");
const customErrors = await page.$$eval(".error", (nodes) => nodes.length);
check("custom errors", customErrors >= 2, String(customErrors));
await page.type("#custom-name", "Ada");
await page.type("#custom-email", "ada@example.com");
await page.click(".paper-form button");
await page.waitForSelector(".success-card");
await page.screenshot({ path: "scripts/custom-1280.png", fullPage: true });
await overflow(390, "/custom");
await overflow(390, "/contact");

const footer = await page.$eval(".footer-fine", (node) => node.textContent.trim());
check("footer", footer.includes("Heliant Hook"), footer);

await browser.close();
if (failures.length) {
  console.log(failures.join("\n"));
  process.exit(1);
}
console.log("phase 3 checks passed");
