import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 1000 });
await page.goto("http://127.0.0.1:5173/shop/daisy-day-bag", { waitUntil: "networkidle2" });
await page.screenshot({ path: "scripts/phase4-product.png", fullPage: true });
await page.setViewport({ width: 390, height: 844 });
await page.screenshot({ path: "scripts/phase4-product-mobile.png", fullPage: true });
await browser.close();
