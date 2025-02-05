import markdownit from 'markdown-it'
import { run, topOfStack, printResult } from "@ligature/ligature";
import he from "he";

export default function sisalPlugin(eleventyConfig, pluginOptions) {
	eleventyConfig.addDataExtension("wander", (contents) => {
    let res = run(contents)
    let value = topOfStack(res)
    return JSON.parse(value.value)
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
