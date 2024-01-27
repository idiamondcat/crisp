import Param from "../../types/elementCreator/param";
import View from "../utils/view";
import popapTemplate from "./template";

export default class Popap extends View {
  public popap: HTMLElement | null;

  constructor() {
    const params: Param = {
      tag: "section",
      classNames: [`popap`],
      textContent: undefined,
      innerHTML: popapTemplate,
    };
    super(params);
    this.popap = this.getHTMLElement();
  }

  public static open(inner: string, el?: HTMLElement) {
    const popapBox = document.querySelector(".popap");
    if (popapBox) popapBox.classList.add("active");
    const innerBox = document.querySelector(".popap__content");
    if (innerBox instanceof HTMLElement && innerBox) innerBox.innerHTML = inner;
    if (el) {
      innerBox?.append(el);
    }
    document.body.classList.add("lock");
    Popap.close();
  }

  public static close() {
    const papupBtnClose = document.querySelector(".popap__x");
    const popapBox = document.querySelector(".popap");
    if (papupBtnClose && popapBox) {
      papupBtnClose.addEventListener("click", () => {
        document.body.classList.remove("lock");
        popapBox.classList.remove("active");
      });
    }
  }
}
