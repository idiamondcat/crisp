import Param from "../../types/elementCreator/param";
import View from "../utils/view";
import preloader from "./template";

export default class Preloader extends View {
  public preloaderElem: HTMLElement | null;

  constructor() {
    const params: Param = {
      tag: "div",
      classNames: ["preloader-overlay", "preloader-overlay--off"],
      textContent: undefined,
      innerHTML: preloader,
    };
    super(params);
    this.preloaderElem = this.getHTMLElement();
  }

  public static showLoader() {
    const overlay: HTMLElement | null =
      document.querySelector(".preloader-overlay");
    if (overlay) {
      overlay.classList.remove("preloader-overlay--off");
      setTimeout(() => {
        overlay.classList.add("preloader-overlay--off");
      }, 2500);
    }
  }
}
