import View from "../utils/view";
import Param from "../../types/elementCreator/param";
import asideTemplate from "./template";

export default class Aside extends View {
  public aside: HTMLElement | null;

  constructor() {
    const params: Param = {
      tag: "aside",
      classNames: ["aside", "aside--hidden"],
      textContent: undefined,
      innerHTML: asideTemplate,
    };
    super(params);
    this.aside = this.getHTMLElement();
  }

  public static openAside(innerdata: string) {
    const asideElem = document.querySelector(".aside");
    if (asideElem) {
      asideElem.classList.remove("aside--hidden");
      const asideContent = asideElem.querySelector(".aside__content");
      const asideCloseBtn = asideElem.querySelector(".aside__close-btn");
      if (asideContent) asideContent.innerHTML = innerdata;
      if (asideCloseBtn) {
        asideCloseBtn.addEventListener("click", (e: Event): void => {
          e.preventDefault();
          this.closeAside();
        });
      }
    }
  }

  public static closeAside() {
    const asideElem = document.querySelector(".aside");
    if (asideElem) {
      const asideContent = asideElem.querySelector(".aside__content");
      asideElem.classList.add("aside--hidden");
      if (asideContent) asideContent.innerHTML = "";
    }
  }
}
