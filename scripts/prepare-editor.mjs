import { cpSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const destination = new URL("../public/vendor/hugerte/", import.meta.url);
mkdirSync(destination, { recursive: true });
cpSync(
  fileURLToPath(new URL("../node_modules/hugerte/", import.meta.url)),
  fileURLToPath(destination),
  { recursive: true },
);

// Keep third-party license notices alongside the production assets.
const packages = [
  ["hugerte", "license.txt"],
  ["@hugerte/hugerte-react", "LICENSE.txt"],
  ["@hugerte/framework-integration-shared", "LICENSE.txt"],
  ["react", "LICENSE"],
  ["react-dom", "LICENSE"],
  ["scheduler", "LICENSE"],
  ["loose-envify", "LICENSE"],
  ["js-tokens", "LICENSE"],
  ["dompurify", "LICENSE"],
  ["dompurify", "LICENSE-MPL"],
  ["lucide-react", "LICENSE"],
  ["@fontsource-variable/manrope", "LICENSE"],
  ["@fontsource-variable/dm-sans", "LICENSE"],
];
const notices = packages
  .map(([name, license]) => {
    const directory = new URL(`../node_modules/${name}/`, import.meta.url);
    const metadata = JSON.parse(
      readFileSync(new URL("package.json", directory), "utf8"),
    );
    return `${name} ${metadata.version}\n${readFileSync(new URL(license, directory), "utf8")}`;
  })
  .join("\n\n----------------------------------------\n\n");
const licenseDirectory = new URL("../public/vendor/licenses/", import.meta.url);
mkdirSync(licenseDirectory, { recursive: true });
writeFileSync(new URL("THIRD-PARTY-NOTICES.txt", licenseDirectory), notices);
