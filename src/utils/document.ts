import DOMPurify from "dompurify";
import type { Variable } from "../types/template";

export const documentStyles = `body{font-family:Arial,Helvetica,sans-serif;color:#303b35;font-size:14px;line-height:1.75;margin:0;padding:40px;overflow-wrap:anywhere}h1{font-family:Georgia,serif;font-size:34px;line-height:1.2;font-weight:400;letter-spacing:-1px;margin:20px 0 12px}h2{font-size:17px;margin:28px 0 10px}h3{font-size:15px}p{margin:12px 0}hr{border:0;border-top:1px solid #e4e7df;margin:24px 0}a{color:#3d6954}ul,ol{padding-left:22px}li{margin:7px 0}blockquote{border-left:3px solid #789780;padding:8px 20px;margin:24px 0;background:#f4f6f0;color:#53705b}table{max-width:100%}th,td{border:1px solid #dfe5dc;padding:10px;text-align:left}th{background:#f2f5ef}small{font-size:10px;letter-spacing:1px;color:#626e60}img{max-width:100%;height:auto}pre{background:#f2f5ef;padding:16px;white-space:pre-wrap} @media(max-width:450px){body{padding:24px}h1{font-size:28px}}`;

export function renderDocument(html: string, variables: Variable[]): string {
  const clean = DOMPurify.sanitize(html, {
    FORBID_TAGS: ["style", "form", "input", "button", "iframe"],
    FORBID_ATTR: ["srcset"],
  });
  const document = new DOMParser().parseFromString(clean, "text/html");
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const values = new Map(
    variables.map((variable) => [variable.key, variable.value]),
  );
  while (walker.nextNode()) {
    const node = walker.currentNode;
    node.textContent = (node.textContent ?? "").replace(
      /\{\{([a-zA-Z0-9_]+)\}\}/g,
      (token, key) => values.get(key) ?? token,
    );
  }
  return document.body.innerHTML;
}

export function exportDocument(
  title: string,
  html: string,
  viewingStyles = "",
): string {
  const safeTitle = title.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ]!,
  );
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${safeTitle}</title><style>${documentStyles}${viewingStyles}</style></head><body>${html}</body></html>`;
}

// Viewing preferences are never written into a draft or the exported document.
export function documentAppearanceStyles(
  theme: string,
  contrast: string,
): string {
  const dark = theme === "dark";
  const more = contrast === "more";
  const ink = dark
    ? more
      ? "#ffffff"
      : "#e9f1e7"
    : more
      ? "#09150c"
      : "#303b35";
  const paper = dark ? "#132019" : "#ffffff";
  const accent = dark ? "#c9edae" : "#254b35";
  return `html{color-scheme:${dark ? "dark" : "light"}}body{background:${paper};color:${ink}}a{color:${accent}}small,p[style*="#71766e"],p[style*="#527263"]{color:${ink}!important}blockquote,th,pre{background:${dark ? "#24372b" : "#f2f5ef"};color:${ink}}hr,th,td,blockquote{border-color:${dark ? "#adc69a" : "#687e5c"}}${more ? `body *{color:${ink}!important;background-color:transparent!important;border-color:currentColor!important}a{text-decoration:underline}` : ""}@media(forced-colors:active){body{background:Canvas;color:CanvasText}body *{color:inherit!important;background-color:transparent!important;border-color:CanvasText!important}a{color:LinkText!important}::selection{background:Highlight;color:HighlightText}}`;
}
