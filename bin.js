import Eleventy from "@11ty/eleventy"
import SisalPlugin from "./sisal.js"
import path from 'path'
import commandLineArgs from 'command-line-args'
import { run, readNetwork } from "@ligature/ligature"
import fs from 'node:fs';

const optionDefinitions = [
	{ name: 'serve', alias: 's', type: Boolean },
	{ name: 'src', type: String, defaultOption: true },
]

const options = commandLineArgs(optionDefinitions)

let elev = new Eleventy(process.cwd(), process.cwd() + path.sep + "_site", {
    config: function (eleventyConfig) {
		const script = fs.readFileSync(options.src, 'utf8');
		let res = run(script)

		let network = readNetwork("*sisal", res)
		const config = new Map()
		for (let triple of network) {
			if (triple[1].value == ":" && triple[2].value == "11ty.virtual-template") {
				if (!config.has(triple[0].value)) {
					config.set(triple[0].value, {})
				}
			} else if (triple[1].value == "content") {
				if (config.has(triple[0].value)) {
					let entryConfig = config.get(triple[0].value)
					entryConfig.content = triple[2].value
					config.set(triple[0].value, entryConfig)
				} else {
					config.set(triple[0].value, {"content": triple[2].value})
				}
			} else if (triple[1].value == "layout") {
			if (config.has(triple[0].value)) {
				let entryConfig = config.get(triple[0].value)
				entryConfig.layout = triple[2].value
				config.set(triple[0].value, entryConfig)
			} else {
				config.set(triple[0].value, {"layout": triple[2].value})
			}
		}

		}
		for (let [k, v] of config) {
			if (v["content"] != undefined) {
				if (v["layout"] != undefined) {
					eleventyConfig.addTemplate(k, v["content"], {layout: v["layout"]})
				} else {
					eleventyConfig.addTemplate(k, v["content"], {})
				}
			}
		}
		// eleventyConfig.addPlugin(SisalPlugin)
		// eleventyConfig.addTemplate("/index.md", "hello", {})
		// eleventyConfig.addTemplate("index.md", `# Hello`, {layout: "virtual.html"});
		// eleventyConfig.addTemplate("_includes/virtual.html", `<!-- Layout -->{{ content }}`);
	}
})

await elev.write()

if (options.serve) {
	await elev.serve(8080)
}
