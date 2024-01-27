import Param from "../../types/elementCreator/param";
import ElementCreator from "./elementCreator";

export default class View {
  public elementCreator: ElementCreator;

  constructor(params: Param) {
    this.elementCreator = View.createView(params);
  }

  public getHTMLElement(): HTMLElement | null {
    return this.elementCreator.getElement();
  }

  public static createView(params: Param): ElementCreator {
    const elementCreator = new ElementCreator(params);
    return elementCreator;
  }
}
