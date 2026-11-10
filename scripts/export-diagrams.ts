/**
 * Exports the hand-authored SVG diagrams (src/components/diagrams) as standalone SVG files for the
 * native Android app (AndroidSVG: SVG 1.1 + minimal CSS), in a light and a dark variant:
 *
 *   android/app/src/main/assets/content/diagrams/<id>-light.svg
 *   android/app/src/main/assets/content/diagrams/<id>-dark.svg
 *   android/app/src/main/assets/content/diagrams/index.json   (array of diagram ids)
 *
 * The web diagrams colour everything through CSS variables (var(--c1), color-mix tokens, translucent
 * --input, ...). Here each diagram is rendered with react-dom/server, loaded in headless Chromium together
 * with the compiled app CSS (src/app/globals.css through Tailwind), and every fill / stroke / stop-color is
 * read back from the *computed* style and written as an explicit opaque `#rrggbb` attribute (translucent
 * colours are composited over the theme background). Run with `npm run export:diagrams`.
 */
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "@playwright/test";
import postcss from "postcss";
import tailwind from "@tailwindcss/postcss";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Diagram } from "../src/components/diagrams";
import type { DiagramId } from "../src/lib/content/types";

const ROOT = join(import.meta.dirname, "..");
const OUT = join(ROOT, "android", "app", "src", "main", "assets", "content", "diagrams");

/** Diagram ids come from the DiagramId union so a new diagram cannot be silently skipped. */
function diagramIds(): DiagramId[] {
  const src = readFileSync(join(ROOT, "src", "lib", "content", "types.ts"), "utf8");
  const union = /export type DiagramId =([^;]+);/.exec(src)?.[1];
  if (!union) throw new Error("DiagramId union not found in src/lib/content/types.ts");
  return [...union.matchAll(/"([a-z0-9-]+)"/g)].map((m) => m[1] as DiagramId);
}

async function compileCss(): Promise<string> {
  const file = join(ROOT, "src", "app", "globals.css");
  const result = await postcss([tailwind()]).process(readFileSync(file, "utf8"), { from: file });
  return result.css;
}

const THEMES = ["light", "dark"] as const;

/** Runs inside the page: inlines computed colours into the SVG and returns the serialised markup. */
function inlineColors(): string {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  const hex = (n: number) => n.toString(16).padStart(2, "0");
  const bg = getComputedStyle(document.body).backgroundColor;

  /** Any CSS colour (rgb / oklch / color(srgb) / ...) -> opaque #rrggbb, composited over the page background. */
  const opaque = (css: string): string => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1, 1);
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `#${hex(r)}${hex(g)}${hex(b)}`;
  };
  const resolve = (value: string): string => (value === "none" || value === "" ? "none" : opaque(value));

  const svg = document.querySelector("svg")!;
  const els = [svg, ...svg.querySelectorAll("*")];
  for (const el of els) {
    const tag = el.tagName.toLowerCase();
    if (tag === "title" || tag === "desc" || tag === "defs" || tag === "marker" || tag === "svg") continue;
    const cs = getComputedStyle(el);
    if (tag === "stop") {
      el.setAttribute("stop-color", resolve(cs.stopColor));
      continue;
    }
    // Children inherit from the explicit root <g fill>, so only write what an element actually sets or needs.
    const isShape = /^(rect|circle|ellipse|path|line|polyline|polygon|text|tspan|g|use)$/.test(tag);
    if (!isShape) continue;
    el.setAttribute("fill", resolve(cs.fill));
    if (tag !== "g" && tag !== "text" && tag !== "tspan") {
      el.setAttribute("stroke", resolve(cs.stroke));
    } else if (el.hasAttribute("stroke")) {
      el.setAttribute("stroke", resolve(cs.stroke));
    }
  }

  svg.removeAttribute("class");
  svg.removeAttribute("role");
  svg.removeAttribute("style");
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  for (const el of els) {
    el.removeAttribute("class");
    el.removeAttribute("style");
    if (el.getAttribute("font-family") === "inherit") el.setAttribute("font-family", "sans-serif");
  }
  const walker = document.createTreeWalker(svg, NodeFilter.SHOW_COMMENT);
  const comments: Node[] = [];
  while (walker.nextNode()) comments.push(walker.currentNode);
  comments.forEach((c) => c.parentNode?.removeChild(c));

  return new XMLSerializer().serializeToString(svg);
}

async function main() {
  const ids = diagramIds();
  const css = await compileCss();
  const markup = new Map(
    ids.map((id) => [id, renderToStaticMarkup(createElement(Diagram, { id }))] as const),
  );

  mkdirSync(OUT, { recursive: true });
  for (const f of readdirSync(OUT)) if (/\.svg$/.test(f)) rmSync(join(OUT, f));

  const browser = await chromium.launch();
  try {
    for (const theme of THEMES) {
      const page = await browser.newPage();
      // tsx (esbuild keepNames) wraps functions in __name(); the browser context needs a no-op shim.
      await page.setContent(
        `<!doctype html><html class="${theme === "dark" ? "dark" : ""}"><head><style>${css}</style></head>` +
          `<body><div id="root"></div></body></html>`,
      );
      await page.evaluate("window.__name = (fn) => fn;");
      for (const id of ids) {
        await page.evaluate((html) => {
          document.getElementById("root")!.innerHTML = html;
        }, markup.get(id)!);
        const svg = await page.evaluate(inlineColors);
        const file = join(OUT, `${id}-${theme}.svg`);
        writeFileSync(file, `<?xml version="1.0" encoding="UTF-8"?>\n${svg}\n`);
        const bad = /var\(|color-mix|rgba|oklch|lab\(|oklab|hsl|foreignObject|<style/.exec(svg);
        if (bad) throw new Error(`${id}-${theme}: forbidden "${bad[0]}" left in output`);
      }
      await page.close();
    }
  } finally {
    await browser.close();
  }

  writeFileSync(join(OUT, "index.json"), JSON.stringify(ids, null, 2) + "\n");
  console.log(`Exported ${ids.length} diagrams x ${THEMES.length} themes to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
