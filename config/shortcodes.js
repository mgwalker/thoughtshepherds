import Image from "@11ty/eleventy-img";
import path from "node:path";

const image = async (imageName) => {
  // Eleventy provides a convenient utility for copying images and renaming them
  // in the process. It even provides us with the hash so we don't have to
  // implement that ourselves! :yay:
  const metadata = await Image(path.join("images", imageName), {
    formats: ["png"],
    outputDir: "./_dist/assets/images/",
    filenameFormat: (id, src, _, format) => {
      const basename = path.basename(src, `.${format}`);
      return `${basename}.${id}.${format}`;
    },
  });

  return metadata.png[0].outputPath.replace("_dist/", "");
};

export default (eleventyConfig) => {
  eleventyConfig.addShortcode("image", image);
};
