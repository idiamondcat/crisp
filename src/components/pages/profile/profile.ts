import { Address } from "@commercetools/platform-sdk";
import { Emitter } from "../../utils/eventEmitter";
import Personal from "./personal";
import Account from "./account";
import AddressElem from "./address";
import switchTab from "../../utils/switchTab";
import showPassword from "../../utils/showPassword";
import validationForm from "./validationForm";

export default class Profile {
  constructor(
    private id: string,
    private firstName: string,
    private lastName: string,
    private dateOfBirth: string,
    private email: string,
    private version: number,
    private addresses: Address[],
    private shippingAddressIds: string[],
    private billingAddressIds: string[],
    private defaultShippingAddressId?: string | undefined,
    private defaultBillingAddressId?: string | undefined,
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.email = email;
    this.version = version;
    this.addresses = addresses;
    this.defaultShippingAddressId = defaultShippingAddressId;
    this.defaultBillingAddressId = defaultBillingAddressId;
    this.shippingAddressIds = shippingAddressIds;
    this.billingAddressIds = billingAddressIds;
    Emitter.on(
      "updatePersonalData",
      (
        personalVersion: number,
        personalFirstName: string,
        personalLastName: string,
        personalDateOfBirth: string,
      ): void => {
        this.version = personalVersion;
        this.firstName = personalFirstName;
        this.lastName = personalLastName;
        this.dateOfBirth = personalDateOfBirth;
      },
    );
    Emitter.on(
      "updateEmail",
      (accountEmail: string, accountVersion: number): void => {
        this.version = accountVersion;
        this.email = accountEmail;
      },
    );
    Emitter.on("updateCurrComponent", (currPage: HTMLElement) => {
      this.loadCurrPage(currPage);
    });
    Emitter.on(
      "updateAddressData",
      (
        addressVersion: number,
        addressAddresses: Address[],
        addressShippingAddressIds: string[],
        addressBillingAddressIds: string[],
      ) => {
        this.version = addressVersion;
        this.addresses = addressAddresses;
        this.shippingAddressIds = addressShippingAddressIds;
        this.billingAddressIds = addressBillingAddressIds;
      },
    );
    Emitter.on(
      "updateAllAddressesShipping",
      (
        shippingVersion: number,
        shippingIds: string[],
        defaultShippingId: string,
      ): void => {
        this.version = shippingVersion;
        this.shippingAddressIds = shippingIds;
        this.defaultShippingAddressId = defaultShippingId;
      },
    );
    Emitter.on(
      "updateAllAddressesBilling",
      (
        billingVersion: number,
        billingIds: string[],
        defaultBillingId: string,
      ): void => {
        this.version = billingVersion;
        this.billingAddressIds = billingIds;
        this.defaultBillingAddressId = defaultBillingId;
      },
    );
    Emitter.on(
      "changeAdressFromAside",
      (changeVersion: number, changeAddresses: Address[]) => {
        this.version = changeVersion;
        this.addresses = changeAddresses;
      },
    );
    Emitter.on(
      "removeAddress",
      (
        changeVersion: number,
        changeAddresses: Address[],
        changeBillingAddressIds: string[],
        changeShippingAddressIds: string[],
        changeDefaultBillingAddressId: string | undefined,
        changeDefaultShippingAddressId: string | undefined,
      ) => {
        this.version = changeVersion;
        this.addresses = changeAddresses;
        this.billingAddressIds = changeBillingAddressIds;
        this.shippingAddressIds = changeShippingAddressIds;
        this.defaultBillingAddressId = changeDefaultBillingAddressId;
        this.defaultShippingAddressId = changeDefaultShippingAddressId;
      },
    );
  }

  public init(): void {
    const tabs: NodeListOf<HTMLElement> =
      document.querySelectorAll(".profile__link");
    const panels: NodeListOf<HTMLElement> =
      document.querySelectorAll(".profile__data");
    const initialActiveTab: HTMLElement | null = document.querySelector(
      ".profile__item > [aria-selected]",
    );
    if (initialActiveTab) {
      const initialPage: HTMLElement | null = document.querySelector(
        `.profile__border-wrapper > [aria-labelledby = ${initialActiveTab.id}]`,
      );
      if (initialPage) this.loadCurrPage(initialPage);
    }
    document.addEventListener("keyup", (e: Event): void => {
      e.preventDefault();
      const { target } = e;
      if (target) {
        validationForm(target as HTMLInputElement);
      }
    });
    document.addEventListener("change", (e: Event): void => {
      const { target } = e;
      if (target) {
        if ((target as HTMLElement).tagName === "INPUT") {
          if ((target as HTMLElement).id === "profile_birthdate") {
            validationForm(target as HTMLInputElement);
          }
        }
      }
    });
    if (tabs) {
      Array.prototype.forEach.call(tabs, (tab) => {
        tab.addEventListener("click", (e: Event) => {
          e.preventDefault();
          e.stopPropagation();
          const activeTab: HTMLElement | null = document.querySelector(
            ".profile__item > [aria-selected]",
          );
          if (e.target !== activeTab) {
            if (activeTab) {
              switchTab(
                e.target as HTMLElement,
                activeTab,
                tabs,
                panels,
                "profile__link--active",
              );
              const activePage: HTMLElement | null = document.querySelector(
                `.profile__border-wrapper > [aria-labelledby = ${
                  (e.target as HTMLElement).id
                }]`,
              );
              if (activePage) {
                this.loadCurrPage(activePage);
              }
            }
          }
        });
      });
    }
  }

  private loadCurrPage(currpage: HTMLElement): void {
    currpage.innerHTML = "";
    const currPageAttr: string | null =
      currpage.getAttribute("aria-labelledby");
    if (currPageAttr) {
      switch (currPageAttr) {
        case "tab1":
          currpage.append(
            new Personal(
              this.firstName,
              this.lastName,
              this.dateOfBirth,
              this.id,
              this.version,
            ).createPersonal(),
          );
          break;
        case "tab2":
          currpage.append(
            new Account(this.email, this.id, this.version).createAccount(),
          );
          showPassword();
          break;
        case "tab3":
          currpage.append(
            new AddressElem(
              this.addresses,
              this.shippingAddressIds,
              this.billingAddressIds,
              this.id,
              this.version,
              this.defaultShippingAddressId,
              this.defaultBillingAddressId,
            ).createAccount(),
          );
          Emitter.emit("addressLoad");
          break;
        default:
          break;
      }
    }
  }
}
