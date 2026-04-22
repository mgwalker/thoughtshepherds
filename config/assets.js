import autoprefixer from "autoprefixer";
import esbuild from "esbuild";
import { sassPlugin } from "esbuild-sass-plugin";
import path from "node:path";
import postcss from "postcss";

// The files that serves as entrypoints for our asset builds.
const entryPoints = ["styles/main.scss", "js/app.js"];

const build = async () =>
  esbuild.build({
    entryPoints,
    outdir: "_dist/assets",
    format: "iife",
    loader: {
      ".png": "dataurl",
      ".svg": "dataurl",
      ".ttf": "dataurl",
      ".woff": "dataurl",
      ".woff2": "dataurl",
    },
    minify: process.env.ELEVENTY_ENV === "production",
    sourcemap: process.env.ELEVENTY_ENV !== "production",
    target: ["chrome58", "firefox57", "safari11", "edge18"],
    plugins: [
      sassPlugin({
        // Setup a transformer to run postcss autoprefixer on generated CSS.
        // This widens browser support (or enables it all for some CSS
        // properties that are still locked behind prefixes).
        transform: async (source, _, srcPath) => {
          const { css } = await postcss([autoprefixer]).process(source, {
            // Set this "from" property so sourcemaps will work correctly.
            from: srcPath,
          });
          return css;
        },
      }),
    ],
    bundle: true,
  });

export default (eleventyConfig) => {
  // Do an asset build on startup so we can be sure everything is fresh from
  // the get-go.
  build();

  // Watch for any changes to our JS or Sass
  eleventyConfig.addWatchTarget("./js");
  eleventyConfig.addWatchTarget("./styles");

  // Hook into the watch/serve pre-build event. This is triggered immediately
  // before eleventy begins rebuilding whatever has changed.
  eleventyConfig.on("beforeWatch", async (changedFiles) => {
    // If any of the files that were changed are also our entry points, then we
    // should rebuild all of our assets.
    //
    // TODO: There's probably a bug here where asset rebuilds only happen if the
    // entrypoint files themselves are changed. There's also possibly an
    // optimization here to only rebuild the JS or Sass, depending on which one
    // changed. But for now... just do both.
    const doBuild = changedFiles.some((file) =>
      entryPoints.includes(path.normalize(file)),
    );

    if (doBuild) {
      await build();
    }
  });
};
