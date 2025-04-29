import { runScript } from '@ligature/ligature-components';

export function sisalInit() {
    document.querySelectorAll(".wander").forEach(el => {
      const script = el.getAttribute("data-script")
      el.setAttribute("data-script", "")
      runScript(script, el)
    })
  }
