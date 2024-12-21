import markdownit from 'markdown-it'
import { run } from "@ligature/ligature";

function printNetwork(n) {
  let res = "{\n"
  for (let [e,a,v] of n) {
      res = res + "  " + printValue(e) + " " + printValue(a) + " " + printValue(v) + ",\n"
  }
  return res + "}"
}

function printValue(value) {
  if (value.type == 'element') {
      return value.value
  } else if (value.type == 'literal') {
      return value.value
  } else if (value.type == 'network') {
      return printNetwork(value.value)
  } else if (value.type == 'quote') {
      throw "TODO"
  } else if (value.type == 'variable') {
      return value.value
  } else {
      throw "should never reach"
  }
}

const md = markdownit()

function createUiComponent(buffer) {
  return [
    {
      name: "write",
      doc: "Write a value.",
      action: (args) => {
        if (args.length == 1) {
          buffer.push(printValue(args[0]))
        } else {
          throw "Illegal call to write."
        }
      }
    },
    {
      name: "md",
      doc: "Write markdown content.",
      action: (args) => {
        if (args.length == 1) {
          buffer.push(md.render(args[0].value))
        } else {
          throw "Illegal call to write."
        }
      }
    }
  ]
}

export default function sisalPlugin(eleventyConfig, pluginOptions) {
	eleventyConfig.addDataExtension("wander", (contents) => {
    let res = run(contents, [])
    if (res.type == "resultset") {
      let mappedRes = res.value.map(resultSet => Object.fromEntries(resultSet))
      return mappedRes
    }
  });
  eleventyConfig.addMarkdownHighlighter((str, lang) => {
    if (lang != undefined && lang === "wander") {
      let result = run(str)
      return str + "\n<hr>\nResult:\n" + result //TODO encode string for html
    } else {
      return str
    }
  })
  eleventyConfig.addTemplateFormats("wandert")
  eleventyConfig.addExtension("wandert", {
    compile: async (inputContent) => {
      return async () => {
        var buffer = [];
        run(inputContent, createUiComponent(buffer))
        return buffer.join("")
      };
    },
  });
}
