import { Emitter } from "./eventEmitter";

export default function switchTab(
  currTab: HTMLElement,
  prevTab: HTMLElement,
  tabs: NodeListOf<HTMLElement>,
  panels: NodeListOf<HTMLElement>,
  activeClass: string,
  activeAsideTab?: HTMLElement | null,
): void {
  currTab.focus();
  currTab.classList.add(activeClass);
  currTab.removeAttribute("tabindex");
  currTab.setAttribute("aria-selected", "true");
  prevTab.classList.remove(activeClass);
  prevTab.removeAttribute("aria-selected");
  prevTab.setAttribute("tabindex", "-1");
  const currIdx: number = Array.prototype.indexOf.call(tabs, currTab);
  const oldIdx: number = Array.prototype.indexOf.call(tabs, prevTab);
  panels[oldIdx].hidden = true;
  panels[currIdx].hidden = false;
  if (activeClass === "profile__link--active") {
    Emitter.emit("updateCurrComponent", panels[currIdx]);
  } else if (activeClass === "aside__link--active") {
    if (activeAsideTab) {
      Emitter.emit("updateAsideLink", currTab);
    }
  }
}
