import markdownit from 'markdown-it'
import { run } from "@ligature/ligature";
import he from "he";

export default function sisalPlugin(eleventyConfig, pluginOptions) {
	// eleventyConfig.addDataExtension("wander", (contents) => {
  //   let res = run(contents, [])
  //   if (res.type == "resultset") {
  //     let mappedRes = res.value.map(resultSet => Object.fromEntries(resultSet))
  //     return mappedRes
  //   }
  // });
  eleventyConfig.addMarkdownHighlighter((str, lang) => {
    if (lang != undefined && lang === "wander") {
      let result = run(str)
      return "<span class='code'>" + he.encode(str) + "</span>\n<hr>\nResult:\n" + he.encode(printValue(result))
    } else {
      return he.encode(str)
    }
  })
}
