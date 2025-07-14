import { runAndGenerateHtml } from "@ligature/ligature";
import he from "he";
import { Liquid } from "liquidjs"

const isProduction = true

export default function sisalPlugin(eleventyConfig, pluginOptions) {

  eleventyConfig.addTemplateFormats("wander");

  const engine = new Liquid({
    templates: {}
  });

  const embedTemplate = engine.parse("<div class=\"wander\" data-script=\"{{script | escape}}\" ></div>");

	eleventyConfig.addExtension("wander", {
		compile: async (inputContent) => {

      return async (data) => {
        let res = runAndGenerateHtml(inputContent)
        return res
      };
		},
	});


	eleventyConfig.addExtension("wander-embed", {
		compile: async (inputContent) => {
			return async () => {
        return engine.render(embedTemplate, { script: inputContent })			
      };
		},
	});


  // eleventyConfig.addDataExtension("wander", (contents) => {
  //   let res = run(contents)
  //   return res
  //   //return resultToJs(res)
  // });
  // eleventyConfig.addMarkdownHighlighter((str, lang) => {
  //   if (lang != undefined && lang === "wander") {
  //     let result = run(str)
  //     return "<span class='code'>" + he.encode(str) + "</span>\n<hr>\nResult:\n" + he.encode(printResult(result))
  //   } else {
  //     return he.encode(str)
  //   }
  // })
}
