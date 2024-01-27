import CartAPI from "../../sdk/cart/cart";
import FooterView from "../footer/footer";
import HeaderView from "../header/header";
import { CartIco } from "../header/indicator";
import MainView from "../main/main";
import Preloader from "../preloader/preloader";

export default class App {
  public static async createView() {
    const preloaderView = new Preloader();
    const footerView = new FooterView();
    const headerView = new HeaderView();
    const mainView = new MainView();

    const preloaderElem = preloaderView.getHTMLElement();
    const footerElement = footerView.getHTMLElement();
    const headerElement = headerView.getHTMLElement();
    const mainElement = mainView.getHTMLElement();

    if (preloaderElem && footerElement && headerElement && mainElement) {
      document.body.append(
        preloaderElem,
        headerElement,
        mainElement,
        footerElement,
      );
      await CartAPI.checkMyCart();
      CartIco.checkCart();
    } else {
      throw new Error("Element is null.");
    }
  }
}
