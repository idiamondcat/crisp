import link from "../../../types/link/Ilink";
/* eslint-disable import/no-cycle */
import Registration from "../../pages/registration/registration";
import setShippingDefault from "../../pages/registration/select default address checkbox/setDefaultShipping";
import Login from "../../pages/login/login";
import Profile from "../../pages/profile/profile";
import {
  handleLocation,
  routeToNotAnchor,
  routeforOtherLink,
} from "../../utils/router";
import HeaderView from "../header";
import { getUserById } from "../../../sdk/sdk";
import { Address } from "../../../types/types";
import { Product } from "../../pages/product/product";
import productKeys from "../../pages/product/productsKey";
import { Catalog } from "../../pages/catalog/catalog";
import { createCartTable } from "../../pages/basket/basket";
import { onBrandsBlockClick } from "../../pages/main/onBransBlockClick";
import Alert from "../../alerts/alert";

const namePage = {
  MAIN: "MAIN",
  LOGIN: "LOG IN",
  LOGOUT: "LOG OUT",
  CREATEACCOUNT: "CREATE ACCOUNT",
  CATALOG: "CATALOG",
  PROFILE: "PROFILE",
  BASKET: "BASKET",
  ABOUT: "ABOUT US",
  PRODUCT: "PRODUCT",
};

export const pages: link[] = [
  {
    name: namePage.MAIN,
    href: "/",
    callback: (): void => {
      const brandsBlock = document.querySelector(".main_brands__list");
      const discountBlock = document.querySelector(".main_discount");
      const showNowBtn = document.querySelector(".button-main");
      brandsBlock?.addEventListener("click", (event) => {
        onBrandsBlockClick(event);
      });
      showNowBtn?.addEventListener("click", (event) => {
        routeToNotAnchor(event, "catalog", pages[2].callback);
      });
      if (discountBlock) {
        discountBlock.addEventListener("click", (e: Event) => {
          const { target } = e;
          if ((target as HTMLElement).tagName === "BUTTON") {
            if (
              (target as HTMLElement).classList.contains("main_discount-btn")
            ) {
              e.preventDefault();
              const codeText: string = (target as HTMLElement).innerText;
              navigator.clipboard.writeText(codeText);
              Alert.showAlert(false, "Promocode copied!");
            }
          }
        });
      }
    },
  },
  {
    name: namePage.ABOUT,
    href: "/about",
    callback: (): void => {},
  },
  {
    name: namePage.CATALOG,
    href: "/catalog",
    callback: (): void => {
      const catalog = new Catalog();
      catalog.init();
    },
  },
];

export const profileLinks: link[] = [
  {
    name: namePage.LOGIN,
    classList: ["account__item", "sigh"],
    innerHTML: `<svg class="sigh-in" xmlns="http://www.w3.org/2000/svg" height="26" viewBox="0 -960 960 960" width="26">
                  <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z" fill="#ffffff"/>
                </svg>
                <span class="account__item-text">Log In</span>`,
    href: "/login",
    callback: (): void => {
      const login = new Login();
      const func: (event: Event) => void = (event: Event): void => {
        const { target } = event;
        if (target) {
          if ((target as HTMLElement).tagName === "BUTTON") {
            if ((target as HTMLInputElement).classList.contains("login__btn")) {
              event.preventDefault();
              if (event instanceof MouseEvent) {
                login.signIn(event);
              }
            }
          } else if (target instanceof HTMLAnchorElement) {
            if (target.classList.contains("login__create-acc-btn")) {
              event.preventDefault();
              if (event instanceof MouseEvent) {
                routeforOtherLink(event);
              }
            }
          }
        }
      };
      document.addEventListener("keyup", (e: Event): void => {
        e.preventDefault();
        const { target } = e;
        if (target) {
          login.validationForm(target as HTMLInputElement);
        }
      });
      document.addEventListener("click", (e: Event): void => func(e));
    },
  },
  {
    name: namePage.CREATEACCOUNT,
    classList: ["account__item", "account__create", "unactive"],
    innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32">
                    <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" fill="#ffffff"/>
                </svg>`,
    href: "/createaccount",
    callback: (): void => {
      const registration = new Registration();
      document.addEventListener("keyup", (e: Event): void => {
        e.preventDefault();
        const { target } = e;
        if (target) {
          registration.validationForm(target as HTMLInputElement);
        }
      });
      document.addEventListener("change", (e: Event): void => {
        e.preventDefault();
        const { target } = e;
        if (target) {
          if ((target as HTMLElement).tagName === "SELECT") {
            if ((target as HTMLElement).id === "billing_country") {
              const postcodeField: HTMLElement | null = document.getElementById(
                "billing_postal_code",
              );
              registration.validationForm(target as HTMLSelectElement);
              if (postcodeField)
                registration.validationForm(postcodeField as HTMLInputElement);
            } else if ((target as HTMLElement).id === "shipping_country") {
              const postcodeField: HTMLElement | null = document.getElementById(
                "shipping_postal_code",
              );
              registration.validationForm(target as HTMLSelectElement);
              if (postcodeField)
                registration.validationForm(postcodeField as HTMLInputElement);
            }
          } else if ((target as HTMLElement).tagName === "INPUT") {
            if ((target as HTMLElement).id === "birthdate") {
              registration.validationForm(target as HTMLInputElement);
            }
          }
        }
      });
      document.addEventListener("click", (event) => {
        event.stopImmediatePropagation();
        const { target } = event;
        if (target instanceof HTMLElement) {
          if (target.id === "sendCreatingAccount") {
            event.preventDefault();
            registration.submitForm(event);
          }
          if (target.id === "billing_address_checkbox") {
            setShippingDefault();
          }
          if (target.classList.contains("form__back-link")) {
            window.history.back();
          }
          if (target.classList.contains("registration__breadcrumbs-link")) {
            event.preventDefault();
            if (event instanceof MouseEvent) {
              routeforOtherLink(event);
            }
          }
          if (target.classList.contains("form__sign-in-link")) {
            event.preventDefault();
            if (event instanceof MouseEvent) {
              routeforOtherLink(event);
            }
          }
        }
      });
    },
  },
  {
    name: namePage.BASKET,
    classList: ["shoping_cart"],
    innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32">
                  <path d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm0-80h480v-480h-80v80q0 17-11.5 28.5T600-520q-17 0-28.5-11.5T560-560v-80H400v80q0 17-11.5 28.5T360-520q-17 0-28.5-11.5T320-560v-80h-80v480Zm160-560h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720ZM240-160v-480 480Z" fill="#ffffff" />
                </svg>
                <span id="shoping_cart__ind"></span>
                `,
    href: "/basket",
    callback: (): void => {
      const mainElem: HTMLElement | null = document.querySelector(".cart");
      if (mainElem) {
        mainElem.addEventListener("click", (e: Event) => {
          const { target } = e;
          if ((target as HTMLElement).tagName === "A") {
            if (
              (target as HTMLElement).classList.contains(
                "cart__continue-btn",
              ) ||
              (target as HTMLElement).classList.contains("cart__start-btn")
            ) {
              e.preventDefault();
              routeforOtherLink(e, pages[2].callback);
            }
          }
        });
        createCartTable();
      }
    },
  },
];

export const profileLinksOut: link[] = [
  {
    name: namePage.LOGIN,
    classList: ["account__item", "sigh-out"],
    innerHTML: `<svg class="sigh-out" id="sighOutSVG" xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32">
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" fill="#ffffff" />
              </svg>
              <span class="account__item-text">Log Out</span>`,
    href: "/signout",
    callback: (): void => {
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      window.history.replaceState({}, "", "/");
      handleLocation();
      const newHeader = new HeaderView();
      const headerElement = newHeader.getHTMLElement();
      const header = document.querySelector("header");
      if (header && header.parentNode && headerElement) {
        header.parentNode.replaceChild(headerElement, header);
      }
    },
  },
  {
    name: namePage.PROFILE,
    classList: ["account__item", "account__create", "active"],
    innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32">
                  <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" fill="#ffffff" />
                </svg>`,
    href: "/profile",
    callback: async (): Promise<void> => {
      const id: string | null = localStorage.getItem("id");
      if (id) {
        const getUserData = await getUserById(id)
          .then((res) => {
            if (res.statusCode !== 400) {
              const {
                firstName,
                lastName,
                dateOfBirth,
                email,
                password,
                version,
                addresses,
                defaultShippingAddressId,
                defaultBillingAddressId,
                shippingAddressIds,
                billingAddressIds,
              } = res.body;
              if (
                firstName &&
                lastName &&
                dateOfBirth &&
                email &&
                password &&
                version &&
                addresses &&
                shippingAddressIds &&
                billingAddressIds
              ) {
                const profilePage = new Profile(
                  id,
                  firstName,
                  lastName,
                  dateOfBirth,
                  email,
                  version,
                  addresses as Address[],
                  shippingAddressIds,
                  billingAddressIds,
                  defaultShippingAddressId,
                  defaultBillingAddressId,
                );
                profilePage.init();
              }
            }
          })
          .catch((err) => console.log(err));
        console.log(getUserData);
      }
    },
  },
  {
    name: namePage.BASKET,
    classList: ["shoping_cart"],
    innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" height="32" viewBox="0 -960 960 960" width="32">
                  <path d="M240-80q-33 0-56.5-23.5T160-160v-480q0-33 23.5-56.5T240-720h80q0-66 47-113t113-47q66 0 113 47t47 113h80q33 0 56.5 23.5T800-640v480q0 33-23.5 56.5T720-80H240Zm0-80h480v-480h-80v80q0 17-11.5 28.5T600-520q-17 0-28.5-11.5T560-560v-80H400v80q0 17-11.5 28.5T360-520q-17 0-28.5-11.5T320-560v-80h-80v480Zm160-560h160q0-33-23.5-56.5T480-800q-33 0-56.5 23.5T400-720ZM240-160v-480 480Z" fill="#ffffff" />
                </svg>
                <span id="shoping_cart__ind"></span>
                `,
    href: "/basket",
    callback: (): void => {
      const mainElem: HTMLElement | null = document.querySelector(".cart");
      if (mainElem) {
        mainElem.addEventListener("click", (e: Event) => {
          const { target } = e;
          if ((target as HTMLElement).tagName === "A") {
            if (
              (target as HTMLElement).classList.contains(
                "cart__continue-btn",
              ) ||
              (target as HTMLElement).classList.contains("cart__start-btn")
            ) {
              e.preventDefault();
              routeforOtherLink(e, pages[2].callback);
            }
          }
        });
        createCartTable();
      }
    },
  },
];

export const product: link[] = productKeys.map((data) => ({
  name: namePage.PRODUCT,
  href: `/product__${data}`,
  callback: (key?: string): void => {
    if (key) {
      // Product.init(`${key}`);
      const p = new Product(`${key}`);
      p.show();
    } else {
      const p = new Product("");
      p.show();
      // Product.init("");
    }
  },
}));
