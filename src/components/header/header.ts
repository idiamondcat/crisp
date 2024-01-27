import Param from "../../types/elementCreator/param";
import ElementCreator from "../utils/elementCreator";
import View from "../utils/view";
/* eslint-disable import/no-cycle */
import LinkView from "./link";
import {
  paramLogo,
  paramsNav,
  paramsProfileBlock,
  cssClasses,
  headerBlockParams,
  paramsNavUl,
  paramBurgerSpan,
  paramBurgerContainer,
} from "./data/params";
/* eslint-disable import/no-cycle */
import { profileLinks, pages, profileLinksOut } from "./data/linkArrays";
import img from "../../assets/icons/logo.png";

const startPageIndex = 0;
export default class HeaderView extends View {
  public linkElements: LinkView[];

  public header: HTMLElement | null;

  public burger: HTMLElement | null;

  constructor() {
    const params: Param = {
      tag: "header",
      classNames: [`${cssClasses.header}`],
    };
    super(params);
    this.header = null;
    this.burger = null;
    this.linkElements = [];
    this.configureView();
    this.clickBurger();
  }

  // eslint-disable-next-line max-lines-per-function
  private configureView(): void {
    const creatorHeaderContainer = new ElementCreator(headerBlockParams);
    this.elementCreator.addInnerELement(creatorHeaderContainer);
    const creatorLogo = new ElementCreator(paramLogo);
    creatorHeaderContainer.addInnerELement(creatorLogo);
    const creatorBurger = new ElementCreator(paramBurgerContainer);
    creatorHeaderContainer.addInnerELement(creatorBurger);
    for (let i = 0; i < 4; i += 1) {
      const creatorBurgerSpan = new ElementCreator(paramBurgerSpan);
      creatorBurger.addInnerELement(creatorBurgerSpan);
    }
    const creatorNav = new ElementCreator(paramsNav);
    creatorHeaderContainer.addInnerELement(creatorNav);
    const creatorNavUl = new ElementCreator(paramsNavUl);
    creatorNav.addInnerELement(creatorNavUl);
    const creatorProfileBlock = new ElementCreator(paramsProfileBlock);
    creatorHeaderContainer.addInnerELement(creatorProfileBlock);

    pages.forEach((item, index) => {
      const linkElement = new LinkView(
        this.linkElements,
        item.name,
        undefined,
        undefined,
        item.href,
        item.callback,
      );
      const newLink = linkElement.getHTMLElement();
      if (newLink) {
        creatorNavUl.addInnerELement(newLink);
        this.linkElements.push(linkElement);
        if (index === startPageIndex) {
          linkElement.setSelectedStatus();
        }
      }
      this.header = creatorHeaderContainer.getElement();
      this.burger = creatorBurger.getElement();
    });

    if (localStorage.token) {
      profileLinksOut.forEach((item, index) => {
        const linkElement = new LinkView(
          this.linkElements,
          undefined,
          item.classList,
          item.innerHTML,
          item.href,
          item.callback,
        );
        const newLink = linkElement.getHTMLElement();
        if (newLink) {
          creatorProfileBlock.addInnerELement(newLink);
          this.linkElements.push(linkElement);
          if (index === startPageIndex) {
            linkElement.setSelectedStatus();
          }
        }
      });
    } else {
      profileLinks.forEach((item, index) => {
        const linkElement = new LinkView(
          this.linkElements,
          undefined,
          item.classList,
          item.innerHTML,
          item.href,
          item.callback,
        );
        const newLink = linkElement.getHTMLElement();
        if (newLink) {
          creatorProfileBlock.addInnerELement(newLink);
          this.linkElements.push(linkElement);
          if (index === startPageIndex) {
            linkElement.setSelectedStatus();
          }
        }
      });
    }

    creatorLogo.setInnerHTML(`<img src="${img}" alt="logo">`);
  }

  public clickBurger() {
    if (this.burger) {
      this.burger.addEventListener("click", () => {
        document.body.classList.toggle("lock");
        this.header?.classList.toggle("open");
        this.burger?.classList.toggle("open");
      });
      document.body.addEventListener("click", (e) => {
        if (
          this.burger?.classList.contains("open") &&
          e.target instanceof HTMLElement &&
          e.target.classList.contains("pages__item")
        ) {
          document.body.classList.remove("lock");
          this.header?.classList.remove("open");
          this.burger?.classList.remove("open");
        }
      });
    }
  }
}
