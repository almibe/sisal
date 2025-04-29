import markdownit from 'markdown-it'
import { run, resultToJs } from "@ligature/ligature";
import he from "he";
import { Liquid } from "liquidjs"

const isProduction = true

export default function sisalPlugin(eleventyConfig, pluginOptions) {
  eleventyConfig.addTemplateFormats("wander");

  const engine = new Liquid();
  const template = engine.parse("<script defer>console.log(\"{{script}}\")</script>");

	eleventyConfig.addExtension("wander", {
		compile: async (inputContent) => {

			return async () => {
        return engine.render(template, { script: inputContent })			
      };
		},
	});

  eleventyConfig.addDataExtension("wander", (contents) => {
    let res = run(contents)
    return resultToJs(res)
  });
  eleventyConfig.addMarkdownHighlighter((str, lang) => {
    if (lang != undefined && lang === "wander") {
      let result = run(str)
      return "<span class='code'>" + he.encode(str) + "</span>\n<hr>\nResult:\n" + he.encode(printResult(result))
    } else {
      return he.encode(str)
    }
  })
}

export function sisalInit() {
  console.log("yay")
}