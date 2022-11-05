"use strict";

const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:8080/longpage.html", {
    waitUntil: "networkidle2",
  });
  // page.pdf() is currently supported only in headless mode.
  // @see https://bugs.chromium.org/p/chromium/issues/detail?id=753118
  await page.pdf({
    path: "longpage.pdf",
    format: "A4",
    displayHeaderFooter: true,
    timeout: 0,
  });

  await browser.close();
})();
