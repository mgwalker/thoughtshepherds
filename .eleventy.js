import configureAssets from "./config/assets.js";
import configureShortcodes from "./config/shortcodes.js";

export default (eleventyConfig) => {
  configureAssets(eleventyConfig);
  configureShortcodes(eleventyConfig);

  return {
    templateFormats: ["md", "njk", "html", "liquid"],
    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "liquid",

    dir: {
      includes: "includes",
      input: "./site",
      output: "_dist",
    },
  };
};
