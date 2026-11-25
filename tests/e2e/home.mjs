// E2E checks of the homepage (Playwright from the studio tools: ~/.veon/tools, found by veon_pw.mjs).
// Usage: node tests/e2e/home.mjs [url]   (default http://localhost:4321/; run `npm run dev` or `npm run preview` first)
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const STUDIO = process.env.VEON_WEB_STUDIO || path.join(os.homedir(), "veon-work", "VEON-WEB-STUDIO");
const { loadPlaywright, launchBrowser } = await import(pathToFileURL(path.join(STUDIO, "quality", "scripts", "veon_pw.mjs")).href);
const { chromium } = loadPlaywright();
const URL_ = process.argv[2] || "http://localhost:4321/";

const SECTIONS = ["hero", "posluhy", "roboty", "yak-diznatysya-tsinu", "vidguky", "pytannya", "kontakty"];
const ALLOWED = ["tel:+380639778741", "tel:+380687782393", "viber://chat?number=%2B380639778741", "whatsapp://send?phone=+380639778741", "mailto:myremontmebliv@gmail.com"];
let failed = 0;
const ok = (cond, msg) => { console.log(`${cond ? "PASS" : "FAIL"}  ${msg}`); if (!cond) failed += 1; };

const browser = await launchBrowser(chromium);
try {
  // 1. Structure, links, content rules (1440)
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(URL_, { waitUntil: "networkidle" });
  const h1 = await page.$$eval("h1", (els) => els.map((e) => e.textContent.replace(/\s+/g, " ").trim()));
  ok(h1.length === 1 && h1[0] === "Перетяжка меблів у Львові", `one H1 «${h1.join(" | ")}»`);
  ok((await page.getAttribute("html", "lang")) === "uk", "html lang=uk");
  const ids = await page.$$eval("main > section[id]", (els) => els.map((e) => e.id));
  ok(JSON.stringify(ids) === JSON.stringify(SECTIONS), `sections in concept order: ${ids.join(", ")}`);
  const hrefs = await page.$$eval("a[href]", (els) => els.map((a) => a.getAttribute("href")));
  const bad = hrefs.filter((h) => !(h.startsWith("#") || ALLOWED.includes(h) || h.startsWith("/_astro/") || h.startsWith("/_image")));
  ok(bad.length === 0, `only anchors, client channels and own images (${hrefs.length} links)${bad.length ? ": " + bad.join(", ") : ""}`);
  const anchors = hrefs.filter((h) => h.startsWith("#") && h.length > 1);
  const missing = [];
  for (const a of anchors) if (!(await page.$(a))) missing.push(a);
  ok(missing.length === 0, `every anchor has a target${missing.length ? ": " + missing.join(", ") : ""}`);
  const html = await page.content();
  ok(!/(href|src|srcset)="[^"]*mebli-service\.com\.ua/i.test(html), "no link or image from the client's current site");
  ok(!/MiySaytStudio|tg:\/\//i.test(html), "no Telegram");
  ok(!/(^|[^\w-])(демо|demo)([^\w-]|$)/i.test(await page.innerText("body")), "no «демо» labels in the interface");
  const fl = await page.$$eval(".future-link", (els) => els.every((e) => e.getAttribute("aria-disabled") === "true" && !e.hasAttribute("href")));
  ok(fl, `FutureLink items are inactive (${await page.locator(".future-link").count()})`);
  const flTab = await page.locator(".future-link[tabindex='0']").count();
  ok(flTab <= 2, `FutureLink tab stops: ${flTab} (≤ 2)`);
  ok((await page.locator(".header__nav a[href='#yak-diznatysya-tsinu']").innerText()).trim() === "Як дізнатися ціну", "menu item «Як дізнатися ціну»");
  ok(await page.locator(".callback__btn[disabled]").count() === 1 && /повній версії сайту/.test(await page.innerText(".callback")), "callback button inactive with the hint");
  const recs = await page.$$eval("[data-rec]", (els) => [...new Set(els.flatMap((e) => e.dataset.rec.split(",")))].sort());
  ok(["R-001", "R-002", "R-005", "R-007", "R-008", "R-012", "R-019"].every((r) => recs.includes(r)), `data-rec for shown recommendations: ${recs.join(" ")}`);
  const noAlt = await page.$$eval("img", (els) => els.filter((i) => !i.hasAttribute("alt")).length);
  ok(noAlt === 0, "every image has alt");
  ok(await page.locator(".reviews blockquote").count() === 5, "5 reviews");
  ok(errors.length === 0, `no script errors${errors.length ? ": " + errors.join("; ") : ""}`);

  // 2. Lightbox and accordion
  await page.locator(".work__link").nth(1).click();
  ok(await page.locator("dialog.lb[open]").count() === 1, "photo opens in the dialog");
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("Escape");
  ok(await page.locator("dialog.lb[open]").count() === 0, "dialog closes with Esc");
  await page.locator(".qa summary").first().click();
  ok(await page.locator(".qa[open]").count() === 1, "question opens");

  // 3. CLS while loading and scrolling
  const cls = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await cls.addInitScript(() => { window.__cls = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: "layout-shift", buffered: true }); });
  await cls.goto(URL_, { waitUntil: "networkidle" });
  for (let y = 0; y < 12000; y += 700) { await cls.mouse.wheel(0, 700); await cls.waitForTimeout(60); }
  await cls.waitForTimeout(600);
  const clsValue = await cls.evaluate(() => window.__cls);
  ok(clsValue < 0.01, `CLS ${clsValue.toFixed(4)}`);

  // 4. No sideways scroll and key elements inside the screen
  for (const w of [320, 360, 375, 390, 768, 1024, 1280, 1440]) {
    const p = await browser.newPage({ viewport: { width: w, height: 844 } });
    await p.goto(URL_, { waitUntil: "networkidle" });
    const over = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    const outside = await p.$$eval("header a, header button, .hero a, .bar a", (els) => els.filter((e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return s.display !== "none" && r.width > 0 && (r.left < -1 || r.right > innerWidth + 1); }).map((e) => e.textContent.trim() || e.getAttribute("aria-label")));
    ok(over <= 0 && outside.length === 0, `${w}px: no sideways scroll, header and first-screen controls inside${outside.length ? " (outside: " + outside.join(", ") + ")" : ""}`);
    if (w === 390) {
      const viber = await p.locator(".hero__viber").boundingBox();
      const bar = await p.locator(".bar").boundingBox();
      ok(viber && bar && viber.y + viber.height <= bar.y, "390: Viber button of the first screen is above the bottom bar");
      await p.click(".header__burger");
      ok(await p.locator("#menu:not([hidden])").count() === 1, "390: menu opens");
      await p.click("#menu a[href='#roboty']");
      ok(await p.locator("#menu[hidden]").count() === 1, "390: menu closes after an anchor");
    }
    await p.close();
  }

  // 5. Reduced motion: nothing animates, everything visible
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const rm = await ctx.newPage();
  await rm.goto(URL_, { waitUntil: "networkidle" });
  const running = await rm.evaluate(() => document.getAnimations().filter((a) => a.playState === "running" && (a.effect?.getTiming().duration ?? 0) > 50).length);
  const hidden = await rm.$$eval("[data-reveal]", (els) => els.filter((e) => getComputedStyle(e).opacity !== "1").length);
  ok(running === 0 && hidden === 0, `reduced motion: ${running} running animations, ${hidden} hidden blocks`);

  // 6. Scripts off: content visible
  const nojs = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
  const nj = await nojs.newPage();
  await nj.goto(URL_, { waitUntil: "networkidle" });
  const hiddenNoJs = await nj.$$eval("[data-reveal]", (els) => els.filter((e) => getComputedStyle(e).opacity !== "1").length);
  ok(hiddenNoJs === 0, "scripts off: all blocks visible");
} finally {
  await browser.close();
}
console.log(failed ? `\n${failed} check(s) failed` : "\nAll checks passed");
process.exit(failed ? 1 : 0);
