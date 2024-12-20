import { run, runResult } from "@ligature/ligature";

export default function sisalPlugin(eleventyConfig, pluginOptions) {
	eleventyConfig.addDataExtension("wander", (contents) => {
    let res = runResult(contents)
    let mappedRes = res.map(resultSet => Object.fromEntries(resultSet))
    return mappedRes
  });
  eleventyConfig.addMarkdownHighlighter((str, lang) => {
    if (lang != undefined && lang === "wander") {
      let result = run(str)
      return str + "\n<hr>\nResult:\n" + result
    } else {
      return str
    }
  })
}
