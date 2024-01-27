import Param from "../../types/elementCreator/param";

export default class ElementCreator {
  private element: HTMLElement | null;

  constructor(param: Param) {
    this.element = null;
    this.createElement(param);
  }

  private createElement(param: Param): void {
    this.element = document.createElement(param.tag);
    this.setCssClasses(param.classNames);

    if (param.textContent) {
      this.setTextContent(param.textContent);
    }

    if (param.innerHTML) {
      this.setInnerHTML(param.innerHTML);
    }

    if (param.href) {
      this.setHref(param.href);
    }
  }

  public getElement(): HTMLElement | null {
    return this.element;
  }

  private setCssClasses(cssClasses: string[]): void {
    cssClasses.forEach((className) => {
      this.element?.classList.add(className);
    });
  }

  private setTextContent(text: string): void {
    if (this.element) {
      this.element.textContent = text;
    }
  }

  public setInnerHTML(text: string): void {
    if (this.element) {
      this.element.innerHTML = text;
    }
  }

  public setHref(text: string): void {
    if (this.element) {
      this.element.setAttribute("href", text);
    }
  }

  public setCallback(callback: (params: MouseEvent) => void): void {
    this.element?.addEventListener("click", (event: MouseEvent) => {
      callback(event);
    });
  }

  public addInnerELement(element: HTMLElement | ElementCreator): void {
    if (element instanceof ElementCreator) {
      const newElement = element.getElement();
      if (newElement) {
        this.element?.append(newElement);
      }
    } else {
      this.element?.append(element);
    }
  }
}
