import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  headless: true,
});
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });
await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle2" });
await page.screenshot({ path: "scripts/palette-home.png", fullPage: true });
await page.goto("http://127.0.0.1:5173/about", { waitUntil: "domcontentloaded" });
await page.screenshot({ path: "scripts/palette-about.png", fullPage: true });
await page.goto("http://127.0.0.1:5173/contact", { waitUntil: "domcontentloaded" });
await page.screenshot({ path: "scripts/palette-contact.png" });
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
await page.setViewport({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:5173/", { waitUntil: "domcontentloaded" });
const mobile = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
console.log(JSON.stringify({ overflow, mobile }));
await browser.close();
