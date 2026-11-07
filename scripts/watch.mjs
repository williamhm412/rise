// Rebuild the browser bundles automatically while you edit src/.
//
// Same bundling as build.mjs (see there), but in esbuild watch mode writing
// straight into public/. dist/ is not restaged: it is only meant to hold the
// final deployable, so run `npm run build` before deploying. Pair this with
// `npm start` in another terminal, then just refresh the browser after edits.
import path from "node:path";
import { fileURLToPath } from "node:url";

import esbuild from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const publicDir = path.join(root, "public");

const bundles = [
  { entry: "src/main.js", outfile: "app.js" },
  { entry: "src/analysis-worker.js", outfile: "analysis-worker.js" }
];

for (const bundle of bundles) {
  const ctx = await esbuild.context({
    entryPoints: [path.join(root, bundle.entry)],
    bundle: true,
    format: "esm",
    outfile: path.join(publicDir, bundle.outfile),
    platform: "browser",
    target: ["es2020"],
    sourcemap: false,
    minify: false
  });
  await ctx.watch();
}

console.log(`Watching src/ — rebuilding ${bundles.map((b) => b.outfile).join(" and ")} into public/ on change. Refresh the browser after each rebuild.`);
