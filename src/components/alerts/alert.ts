import Param from "../../types/elementCreator/param";
import View from "../utils/view";
import alert from "./template";

export default class Alert extends View {
  public alertElem: HTMLElement | null;

  constructor() {
    const params: Param = {
      tag: "div",
      classNames: ["alert", "alert--hidden"],
      textContent: undefined,
      innerHTML: alert,
    };
    super(params);
    this.alertElem = this.getHTMLElement();
  }

  public static showAlert(error: boolean, message: string): void {
    const alertBlock: HTMLDivElement | null = document.querySelector(".alert");
    const alertText: HTMLParagraphElement | null =
      document.querySelector(".alert__message");
    const alertCloseBtn: HTMLButtonElement | null =
      document.querySelector(".alert__close-btn");
    if (alertBlock) {
      alertBlock.classList.remove("alert--hidden");
      if (error === true) {
        alertBlock.classList.remove("alert--success");
        alertBlock.classList.add("alert--error");
      } else {
        alertBlock.classList.remove("alert--error");
        alertBlock.classList.add("alert--success");
      }
      if (alertText) {
        alertText.innerText = message;
      }
      if (alertCloseBtn) {
        alertCloseBtn.addEventListener("click", (e: Event): void => {
          e.preventDefault();
          this.closeAlert();
        });
      }
    }
    setTimeout(() => {
      this.closeAlert();
    }, 3000);
  }

  public static closeAlert(): void {
    const alertBlock: HTMLDivElement | null = document.querySelector(".alert");
    const alertText: HTMLParagraphElement | null =
      document.querySelector(".alert__message");
    if (alertBlock) {
      alertBlock.classList.remove("alert--success");
      alertBlock.classList.remove("alert--error");
      alertBlock.classList.add("alert--hidden");
    }
    if (alertText) {
      alertText.innerText = "";
    }
  }
}
