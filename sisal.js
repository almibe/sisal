import markdownit from 'markdown-it'
import { run, resultToJs } from "@ligature/ligature";
import he from "he";

export default function sisalPlugin(eleventyConfig, pluginOptions) {
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
