import markdownit from 'markdown-it'
import { run, resultToJs } from "@ligature/ligature";
import he from "he";
import { Liquid } from "liquidjs"

const isProduction = true

export default function sisalPlugin(eleventyConfig, pluginOptions) {

  eleventyConfig.addTemplateFormats("wander");

  const engine = new Liquid({
    templates: {
      nodeTemplate: `
    <{{node.name | escape}} {% for attribute in node.attributes %} {{attribute[0] | escape}} = "{{attribute[1].value | escape}}" {% endfor %}>
      {% for child in node.children %}
        {% if child.type == 'literal' %}
          {{ child.value | escape }}
        {% elsif child.type == 'node' %}
          {% render 'nodeTemplate', node: child %}
        {% else %}
          Should never reach.
        {% endif %}
      {% endfor %}
    </{{node.name | escape}}>`
    }
  });

  const embedTemplate = engine.parse("<div class=\"wander\" data-script=\"{{script | escape}}\" ></div>");


	eleventyConfig.addExtension("wander", {
		compile: async (inputContent) => {

      return async (data) => {
        let res = run(inputContent)
        let resJs = resultToJs(res)

        if (resJs.type == "node") {
          return engine.renderFile('nodeTemplate', {node: resJs})
          return JSON.stringify(resJs)
        } else {
          throw "error processing template"
        }
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
