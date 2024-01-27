import Param from "../../types/elementCreator/param";
import View from "../utils/view";
/* eslint-disable import/no-cycle */
import { route } from "../utils/router";

const cssClasses = {
  link: "pages__item",
  itemSelected: "show",
};

export default class LinkView extends View {
  private linkElements;

  constructor(
    linkElements: LinkView[],
    text?: string,
    classList: string[] = ["pages__item"],
    innerHTML?: string,
    href?: string,
    callback?: () => void,
  ) {
    const params: Param = {
      tag: "a",
      classNames: classList,
      textContent: text,
      innerHTML,
      href,
      callback,
    };
    super(params);
    this.linkElements = linkElements;
    this.configureView(callback);
  }

  public setSelectedStatus(): void {
    this.linkElements.forEach((linkElement) =>
      linkElement.setNotSelectedStatus(),
    );
    const element = this.elementCreator.getElement();
    element?.classList.add(cssClasses.itemSelected);
  }

  public setNotSelectedStatus(): void {
    const element = this.elementCreator.getElement();
    element?.classList.remove(cssClasses.itemSelected);
  }

  private configureView(
    callback: ((params?: MouseEvent) => void) | undefined,
  ): void {
    const element = this.elementCreator.getElement();
    element?.addEventListener("click", (event) => {
      this.setSelectedStatus.bind(this);
      route(event, callback);
      event.preventDefault();
    });
  }
}
