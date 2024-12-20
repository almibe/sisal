import Eleventy from "@11ty/eleventy"
import SisalPlugin from "./sisal.js"
import path from 'path'

let elev = new Eleventy(process.cwd(), process.cwd() + path.sep + "_site", {
    config: function (eleventyConfig) {
        eleventyConfig.addPlugin(SisalPlugin)
    }
})

await elev.write()

await elev.serve(8080)
