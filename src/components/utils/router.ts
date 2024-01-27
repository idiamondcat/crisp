import Irouters from "../../types/routers/routers";
/* eslint-disable import/no-cycle */
import {
  pages,
  profileLinks,
  profileLinksOut,
  product,
} from "../header/data/linkArrays";
import Popap from "../popap/popap";
import Aside from "../aside/aside";
import Alert from "../alerts/alert";
import showPassword from "./showPassword";
import productKeys from "../pages/product/productsKey";
import Preloader from "../preloader/preloader";

export const routers: Irouters = {
  "/": "pages/main.html",
  "/catalog": "pages/catalog.html",
  "/about": "pages/about.html",
  "/login": "pages/login.html",
  "/createaccount": "pages/createaccount.html",
  "/basket": "pages/basket.html",
  "/404": "pages/404.html",
  "/profile": "pages/profile.html",
};

productKeys.forEach((key) => {
  routers[`/product__${key}`] = "pages/product.html";
});

export async function getNotFoundPage() {
  return fetch(routers["/404"])
    .then((page) => page.text())
    .catch(() => "404");
}

async function getHTML() {
  const path = window.location.pathname;
  const validPathes = Object.keys(routers);
  if (!validPathes.includes(path)) {
    return getNotFoundPage();
  }
  const data = await fetch(routers[path]);
  if (data.status === 200) {
    return data.text();
  }
  return getNotFoundPage();
}

export async function handleLocation(callback?: () => void): Promise<void> {
  try {
    const html = await getHTML();
    const main = document.querySelector(".main");
    if (main) {
      Preloader.showLoader();
      main.innerHTML = html;
      const popap = new Popap();
      const popapElement = popap.getHTMLElement();
      const aside = new Aside();
      const asideElem = aside.getHTMLElement();
      const alert = new Alert();
      const alertElem = alert.getHTMLElement();
      if (popapElement) main.append(popapElement);
      if (asideElem) main.append(asideElem);
      if (alertElem) main.append(alertElem);
      showPassword();
      window.scrollTo(0, 0);
    }
    if (callback) {
      callback();
    }
  } catch (error) {
    console.error("Произошла ошибка при выполнении handleLocation:", error);
  }
}

(window as WindowEventHandlers).onpopstate = (ev: PopStateEvent) => {
  if (ev.currentTarget instanceof Window) {
    const hrefToFind = ev.currentTarget.location.pathname;
    const foundPage = pages.find((page) => page.href === hrefToFind);
    const productPage = product.find((page) => page.href === hrefToFind);
    if (foundPage) {
      const { callback } = foundPage;
      handleLocation(callback);
    } else if (productPage) {
      const { callback } = productPage;
      handleLocation(callback);
    } else if (localStorage.token) {
      const currentPage = profileLinksOut.find(
        (page) => page.href === hrefToFind,
      );
      if (currentPage) {
        const { callback } = currentPage;
        handleLocation(callback);
      }
    } else {
      const currentPage = profileLinks.find((page) => page.href === hrefToFind);
      if (currentPage) {
        const { callback } = currentPage;
        handleLocation(callback);
      }
    }
  }
};

export const route = (
  e: MouseEvent,
  callback?: ((params?: MouseEvent) => void) | undefined,
): void => {
  const { currentTarget } = e;

  if (currentTarget instanceof HTMLAnchorElement) {
    window.history.pushState({}, "", currentTarget.href);
  }
  if (callback) {
    handleLocation(callback);
  } else {
    handleLocation();
  }
};

export const routeforOtherLink = (e: Event, callback?: () => void): void => {
  const { target } = e;

  if (target instanceof HTMLAnchorElement) {
    window.history.pushState({}, "", target.href);
  }
  if (callback) {
    handleLocation(callback);
  } else {
    handleLocation();
  }
};

export const routeToNotAnchor = (
  e: Event,
  href: string,
  callback?: () => void,
): void => {
  const { target } = e;

  if (target) {
    window.history.pushState({}, "", href);
  }
  if (callback) {
    handleLocation(callback);
  } else {
    handleLocation();
  }
};
