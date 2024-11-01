import { run } from "@ligature/ligature";
import { Liquid } from "liquidjs"

export function printNetwork(result) {
  let res = "{\n"
  for (let entry of result) {
      if (entry.type == "extension") {
          res += "  " + entry.element.symbol + " : " + entry.concept.symbol + ",\n"
      } else if (entry.type == "nonextension") {
          res += "  " + entry.element.symbol + " :¬ " + entry.element.symbol + ",\n"
      } else {
          res += "  " + entry.first.symbol + " " + entry.role.symbol + " " + entry.second.symbol + ",\n"
      }
  }
  return res + "}"
}

function randId() {
  return Math.random().toString(36).replace(/[^a-z]+/g, '');
}

const engine = new Liquid();
const textTemplate = engine.parse(`
  <pre><code>{{output}}</code></pre>
`)
const tableTemplate = engine.parse(`
  <div id="table-{{id}}" class="ligature-display-table"></div>
  <script id="data-{{id}}" type="application/json">{{data}}</script>
`)
const graphTemplate = engine.parse(`
  <div id="graph-{{id}}" class="ligature-display-graph"></div>
  <script id="data-{{id}}" type="application/json">{{data}}</script>
`)

export default function sisalPlugin(eleventyConfig, pluginOptions) {
  eleventyConfig.addTemplateFormats("wander")
  eleventyConfig.addExtension("wander", {
    compile: async (inputContent) => {
      return async () => {
        const scriptResult = run(inputContent)
        if (scriptResult["meta"] != undefined && scriptResult["result"] != undefined) {
          const meta = scriptResult["meta"]
          const res = meta.filter((entry) => 
              entry.type == "role" && 
              entry.first.symbol == "display" && 
              entry.role.symbol == "=")
          if (res.length == 1) {
              const displayType = (res[0]).second.symbol
              if (displayType == "text") {
                  return engine.render(textTemplate, {output: printNetwork(scriptResult["result"])})
              } else if (displayType == "table") {
                  return engine.render(tableTemplate, { id: randId(), data: JSON.stringify(scriptResult["result"]) })
              } else if (displayType == "graph") {
                  return engine.render(graphTemplate, { id: randId(), data: JSON.stringify(scriptResult["result"]) })
              } else {
                  throw "Invalid display metadata provided, only text, graph, table, or notebook display supported currently."
              }
          } else {
              throw "Invalid display metadata provided."
          }
        } else {
            throw "No display metadata provided."
        }
      };
    },
  });
}
