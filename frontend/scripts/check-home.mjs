import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  headless: true,
});
const page = await browser.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await page.setViewport({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle2" });
const data = await page.evaluate(() => ({
  h1: document.querySelector("h1")?.textContent?.replace(/\s+/g, " ").trim(),
  brand: document.querySelector(".wordmark")?.textContent?.replace(/\s+/g, " ").trim(),
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
}));
console.log(JSON.stringify({ data, errors }));
await browser.close();
if (errors.length || data.overflow > 1 || !data.h1?.includes("stitched slowly")) process.exit(1);
