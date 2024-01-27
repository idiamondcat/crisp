import { Address } from "@commercetools/platform-sdk";
import { Actions, Obj, Tuple } from "../../../types/types";
import Alert from "../../alerts/alert";
import { addAddress } from "../../../sdk/sdk";
import { Emitter } from "../../utils/eventEmitter";
import Aside from "../../aside/aside";
import randomKeyGenerator from "../../utils/randomKeyGenerator";
import { createaAddressTemplate } from "./templates";
import NewAddress from "./createAddress";
import switchTab from "../../utils/switchTab";
import validationForm from "./validationForm";

export default class AddressElem {
  private activeAsideTab: HTMLElement | null;

  constructor(
    private addresses: Address[],
    private shippingAddressIds: string[],
    private billingAddressIds: string[],
    private id: string,
    private version: number,
    private defaultShippingAddressId?: string | undefined,
    private defaultBillingAddressId?: string | undefined,
  ) {
    this.addresses = addresses;
    this.defaultShippingAddressId = defaultShippingAddressId;
    this.defaultBillingAddressId = defaultBillingAddressId;
    this.shippingAddressIds = shippingAddressIds;
    this.billingAddressIds = billingAddressIds;
    this.id = id;
    this.version = version;
    this.activeAsideTab = null;
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
        this.updateAddresses();
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
        this.updateAddresses();
      },
    );
    Emitter.on("addressLoad", (): void => {
      this.updateAddresses();
    });
    Emitter.on("updateAsideLink", (currTab: HTMLElement): void => {
      this.activeAsideTab = currTab;
    });
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
        this.updateAddresses();
      },
    );
  }

  public createAccount(): HTMLDivElement {
    const wrapper: HTMLDivElement = document.createElement("div");
    wrapper.className = "profile__addresses-wrapper";
    wrapper.innerHTML = `
        <div class="profile__adresses-header-wrapper">
            <h2 class="subtitle profile__subtitle">Address book</h2>
            <button class="add-btn profile__add-btn" id="add_address_btn" type="button"></button>
        </div>
        <div class="profile__address-section">
            <h3 class="subtitle subtitle--second-level profile__subtitle--second-level">Shipping Addresses</h3>
            <div class="profile__shipping-addresses"></div>
        </div>
        <div class="profile__address-section">
            <h3 class="subtitle subtitle--second-level profile__subtitle--second-level">Billing Addresses</h3>
            <div class="profile__billing-addresses"></div>
        </div>
        `;
    wrapper.addEventListener("click", (e: Event) => {
      const { target } = e;
      if ((target as HTMLElement).tagName === "BUTTON") {
        if ((target as HTMLElement).id === "add_address_btn") {
          e.preventDefault();
          this.addNewAddress();
        }
      }
    });
    this.updateAddresses();
    return wrapper;
  }

  private addNewAddress(): void {
    Aside.openAside(this.createNewAddressTemplate());
    const asideElem: HTMLElement | null = document.querySelector(".aside");
    if (asideElem) {
      const asideTabs: NodeListOf<HTMLElement> =
        asideElem.querySelectorAll(".aside__link");
      const asidePanels: NodeListOf<HTMLElement> =
        asideElem.querySelectorAll(".aside__panel");
      this.activeAsideTab = asideElem.querySelector(
        ".aside__item > [aria-selected]",
      );
      if (asideTabs) {
        Array.prototype.forEach.call(asideTabs, (asideTab) => {
          asideTab.addEventListener("click", (e: Event) => {
            e.preventDefault();
            randomKeyGenerator();
            const activeTab: HTMLElement | null = this.activeAsideTab;
            if (e.target !== activeTab) {
              if (activeTab) {
                switchTab(
                  e.target as HTMLElement,
                  activeTab,
                  asideTabs,
                  asidePanels,
                  "aside__link--active",
                  this.activeAsideTab,
                );
              }
            }
          });
        });
      }
      asideElem.addEventListener("click", (e: Event): void => {
        e.preventDefault();
        e.stopPropagation();
        if ((e.target as HTMLElement).tagName === "BUTTON") {
          if (
            (e.target as HTMLElement).dataset.action === "saveshippingaddress"
          ) {
            this.addAddressAction("shipping");
          } else if (
            (e.target as HTMLElement).dataset.action === "savebillingaddress"
          ) {
            this.addAddressAction("billing");
          }
        }
      });
    }
  }

  private async addAddressAction(addressType: string): Promise<void> {
    if (this.activeAsideTab) {
      const activeAsidePage: HTMLElement | null = document.querySelector(
        `.aside__content > [aria-labelledby = ${this.activeAsideTab.id}]`,
      );
      if (activeAsidePage) {
        const form: HTMLFormElement | null =
          activeAsidePage.querySelector(".aside__form");
        const addressData: Obj = {};
        if (form) {
          const fields: NodeListOf<Element> = form.querySelectorAll(
            ".form__field[required]",
          );
          if (fields) {
            const fieldsArr: Element[] = Array.from(fields);
            if (
              fieldsArr.every((elem): boolean =>
                elem.classList.contains("valid"),
              )
            ) {
              const data = new FormData(form);
              for (const val of data.entries()) {
                const key: string = val[0];
                const newVal: string = val[1] as string;
                addressData[`${key}`] = newVal;
              }
              const {
                countryCode,
                streetName,
                building,
                apartment,
                city,
                postalCode,
              } = addressData;
              const newKey: string = randomKeyGenerator();
              const newAddressObj: Tuple = [
                {
                  action: Actions.addaddress,
                  address: {
                    key: newKey,
                    country: countryCode,
                    city,
                    postalCode,
                    streetName,
                    building,
                    apartment,
                  },
                },
                addressType === "shipping"
                  ? { action: Actions.addshippingaddress, addressKey: newKey }
                  : { action: Actions.addbillingaddress, addressKey: newKey },
              ];
              try {
                const res = await addAddress(
                  this.version,
                  this.id,
                  newAddressObj,
                );
                if (res.statusCode !== 400) {
                  Aside.closeAside();
                  Alert.showAlert(false, "New address successfully added");
                  const {
                    addresses,
                    shippingAddressIds,
                    billingAddressIds,
                    version,
                  } = res.body;
                  if (addresses && shippingAddressIds && billingAddressIds) {
                    this.version = version;
                    this.addresses = addresses;
                    this.shippingAddressIds = shippingAddressIds;
                    this.billingAddressIds = billingAddressIds;
                    Emitter.emit(
                      "updateAddressData",
                      this.version,
                      this.addresses,
                      this.shippingAddressIds,
                      this.billingAddressIds,
                    );
                    this.updateAddresses();
                  }
                } else {
                  throw new Error("Something is wrong");
                }
              } catch (err) {
                Alert.showAlert(true, "New address not added");
                console.log(err);
              }
            } else {
              fieldsArr
                .filter((elem) => !elem.classList.contains("valid"))
                .forEach((elem) => {
                  validationForm(
                    (elem as HTMLInputElement) || (elem as HTMLSelectElement),
                  );
                });
            }
          }
        }
      }
    }
  }

  public updateAddresses(): void {
    const shippingAddressesBlock: HTMLDivElement | null =
      document.querySelector(".profile__shipping-addresses");
    const billingAddressesBlock: HTMLDivElement | null = document.querySelector(
      ".profile__billing-addresses",
    );
    if (shippingAddressesBlock && billingAddressesBlock) {
      shippingAddressesBlock.innerHTML = "";
      billingAddressesBlock.innerHTML = "";
      this.addresses.forEach((address, idx) => {
        const elemID = idx;
        const newAddress = new NewAddress(
          this.version,
          this.id,
          address,
          elemID,
          this.shippingAddressIds,
          this.billingAddressIds,
          this.defaultShippingAddressId,
          this.defaultBillingAddressId,
        );
        if (address.id) {
          if (this.shippingAddressIds.indexOf(address.id) !== -1) {
            if (address.id === this.defaultShippingAddressId) {
              shippingAddressesBlock.prepend(newAddress.createAddress());
            } else {
              shippingAddressesBlock.append(newAddress.createAddress());
            }
          } else if (this.billingAddressIds.indexOf(address.id) !== -1) {
            if (address.id === this.defaultBillingAddressId) {
              billingAddressesBlock.prepend(newAddress.createAddress());
            } else {
              billingAddressesBlock.append(newAddress.createAddress());
            }
          }
        }
      });
    }
  }

  private createNewAddressTemplate(): string {
    return `
        <nav class="aside__nav">
          <ul role="tablist" class="aside__list">
              <li role="presentation" class="aside__item">
                  <a role="tab" href="#shipping" id="tab-1" class="aside__link aside__link--active" aria-selected="true">Shipping Address</a>
              </li>
              <li role="presentation" class="aside__item">
                  <a role="tab" href="#billing" id="tab-2" class="aside__link" tabindex="-1">Billing Address</a>
              </li>
          </ul>
        </nav>
        <section class="aside__panel" id="shipping" role="tabpanel" aria-labelledby="tab-1">${createaAddressTemplate(
          "Add Shipping Address",
          "saveshippingaddress",
        )}</section>
        <section class="aside__panel" id="billing" role="tabpanel" aria-labelledby="tab-2" hidden>${createaAddressTemplate(
          "Add Billing Address",
          "savebillingaddress",
        )}</section>
        `;
  }
}
