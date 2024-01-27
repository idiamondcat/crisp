import Param from "../../../types/elementCreator/param";

export const cssClasses = {
  header: "head",
  headerContainer: ["header", "container"],
  nav: "nav",
  navUl: "pages",
  logo: "logo",
  profileBlock: "account",
  burgerContainer: "burger",
  burgerSpan: "span",
};
export const headerBlockParams: Param = {
  tag: "div",
  classNames: cssClasses.headerContainer,
};

export const paramLogo: Param = {
  tag: "div",
  classNames: [`${cssClasses.logo}`],
};

export const paramsNav: Param = {
  tag: "nav",
  classNames: [`${cssClasses.nav}`],
};

export const paramsNavUl: Param = {
  tag: "div",
  classNames: [`${cssClasses.navUl}`],
};

export const paramsProfileBlock: Param = {
  tag: "div",
  classNames: [`${cssClasses.profileBlock}`],
};

export const paramBurgerContainer: Param = {
  tag: "div",
  classNames: [`${cssClasses.burgerContainer}`],
};

export const paramBurgerSpan: Param = {
  tag: "span",
  classNames: [`${cssClasses.burgerSpan}`],
};
