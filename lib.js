import { runScript, showEditor } from '@ligature/ligature-components';

export function sisalInit() {
    document.querySelectorAll(".wander").forEach(el => {
      const newElement = document.createElement("div")
      const editorElement  = document.createElement("div")
      editorElement.setAttribute("class", "editor")
      const script = el.getAttribute("data-script").trim()
      el.setAttribute("data-script", "")
      el.append(editorElement)
      el.append(newElement)
      const runButton = document.createElement("button")
      let editor = showEditor(editorElement, script)
      runButton.addEventListener("click", e => {
        newElement.innerHTML = ""
        runScript(editor.getValue(), newElement)        
      })
      runButton.textContent = "Run"
      el.append(runButton)
      runScript(script, "text", newElement)
    })
  }
