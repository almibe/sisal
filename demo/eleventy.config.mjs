import { RenderPlugin } from "@11ty/eleventy"
import SisalPlugin from 'sisal'
import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";

export default async function (eleventyConfig) {
    eleventyConfig.addPlugin(EleventyVitePlugin);
    eleventyConfig.addPassthroughCopy("./assets/");
    eleventyConfig.addPlugin(RenderPlugin)
    eleventyConfig.addPlugin(SisalPlugin)
    return {
        dir: {
            output: "_site"
        },
    }
}
