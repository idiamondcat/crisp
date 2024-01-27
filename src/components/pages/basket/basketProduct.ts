import { LineItem } from "@commercetools/platform-sdk";
import CartAPI from "../../../sdk/cart/cart";
import { RemoveLineFromCart, Actions } from "../../../types/types";
import Alert from "../../alerts/alert";
import { totalPrice, correctPrice, subtotalPrice } from "./correctPrice";
import { Emitter } from "../../utils/eventEmitter";
import { CartIco } from "../../header/indicator";

export default class Product {
  constructor(
    private sku: string,
    private version: number,
    private cartId: string,
    private lineItemKey: string,
    private productKey: string,
    private name: string,
    private color: string,
    private size: string,
    private price: number,
    private image: string,
    private quantity: number,
    private currencyCode: string,
    private fractionDigits: number,
    private totalCentAmount: number,
    private discountSize: number | undefined,
    private discountedPrice: number | undefined,
  ) {
    this.sku = sku;
    this.version = version;
    this.cartId = cartId;
    this.lineItemKey = lineItemKey;
    this.productKey = productKey;
    this.name = name;
    this.size = size;
    this.color = color;
    this.price = price;
    this.image = image;
    this.quantity = quantity;
    this.currencyCode = currencyCode;
    this.fractionDigits = fractionDigits;
    this.totalCentAmount = totalCentAmount;
    this.discountSize = discountSize;
    this.discountedPrice = discountedPrice || undefined;
    Emitter.on(
      "updateRow",
      (
        currProductKey: string,
        changedTotal: number,
        discountNum: number,
      ): void => {
        this.changeProductData(currProductKey, changedTotal, discountNum);
      },
    );
  }

  public createProduct(): HTMLDivElement {
    const product: HTMLDivElement = document.createElement("div");
    product.className = "cart__table-row";
    product.id = this.productKey.toLowerCase();
    product.innerHTML = `
    <div class="cart__table-product-col">
      <div class="cart__table-image-wrapper">
        <img class="cart__table-product-image" src="${this.image}">
      </div>
      <div class="cart__table-product-data-wrapper">
        <span class="cart__table-product-name">${this.name}</span>
        <div class="cart__table-product-color-wrapper">
          <span class="cart__table-product-color" style="background-color: ${this.addColor()}"></span>
        </div>
      </div>
    </div>
    <div class="cart__table-price-col">
      <span class="cart__table-text cart__table-text--prices"> ${
        this.discountedPrice
          ? `<span class="default-price default-price--linethrough">${correctPrice(
              this.price,
              this.fractionDigits,
            )} ${this.currencyCode}</span>
        <span class="discount-price">${correctPrice(
          this.discountedPrice,
          this.fractionDigits,
        )} ${this.currencyCode}</span>`
          : `<span class="default-price">${correctPrice(
              this.price,
              this.fractionDigits,
            )} ${this.currencyCode}</span>`
      }
        ${
          this.discountSize
            ? `<span class="discount-size">-${correctPrice(
                this.discountSize,
                this.fractionDigits,
              )} ${this.currencyCode}</span>`
            : ""
        }
      </span>
    </div>
    <div class="cart__table-size-col">
      <span class="cart__table-text">${this.size}</span>
    </div>
    <div class="cart__table-quantity-col">
      <div class="counter read-only cart__counter">
        <button class="counter__decrement-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect y="5" width="12" height="2" fill="#C4C4C4"/>
          </svg>
        </button>
        <input class="counter__field" min="1" name="quantity" value="${
          this.quantity
        }" type="number" maxlength ="10">
        <button class="counter__increment-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect y="5" width="12" height="2" fill="#C4C4C4"/>
            <rect x="7" width="12" height="2" transform="rotate(90 7 0)" fill="#C4C4C4"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="cart__table-total-col">
      <span class="cart__table-text cart__table-total">${correctPrice(
        this.totalCentAmount,
        this.fractionDigits,
      )} ${this.currencyCode}</span>
    </div>
    <div class="cart__table-btns-col">
      <button class="edit-btn"></button>
      <button class="delete-btn"></button>
    </div>
    `;
    product.addEventListener("click", (e: Event) => {
      e.preventDefault();
      const { target } = e;
      if ((target as HTMLElement).tagName === "BUTTON") {
        if ((target as HTMLElement).classList.contains("delete-btn")) {
          this.removeProductFromCart(target as HTMLElement);
        } else if ((target as HTMLElement).classList.contains("edit-btn")) {
          this.editProduct(target as HTMLElement);
        } else if (
          (target as HTMLElement).classList.contains("counter__decrement-btn")
        ) {
          this.decrementValue(target as HTMLElement);
        } else if (
          (target as HTMLElement).classList.contains("counter__increment-btn")
        ) {
          this.incrementValue(target as HTMLElement);
        }
      }
    });
    return product;
  }

  private async removeProductFromCart(target: HTMLElement): Promise<void> {
    const cartBlock: HTMLElement | null =
      document.querySelector(".cart__wrapper");
    const emptyCartBlock: HTMLElement | null =
      document.querySelector(".cart__empty-cart");
    const currentLine: HTMLElement | null = target.closest(".cart__table-row");
    const subtotalElem: HTMLDivElement | null = document.querySelector(
      ".cart__subtotal-num",
    );
    const removedObj: RemoveLineFromCart = {
      action: Actions.removeline,
      lineItemKey: this.lineItemKey,
    };
    try {
      const removeCurrentLine = await CartAPI.removeLine(
        this.quantity,
        removedObj,
      );
      if (removeCurrentLine) {
        if (removeCurrentLine.statusCode !== 400) {
          const {
            lineItems,
            totalPrice: { centAmount, currencyCode, fractionDigits },
          } = removeCurrentLine.body;
          this.quantity = 0;
          Alert.showAlert(false, "Item successfully removed");
          if (currentLine) currentLine.remove();
          if (lineItems) {
            if (lineItems.length !== 0) {
              totalPrice(centAmount, fractionDigits, currencyCode);
              if (subtotalElem) {
                subtotalElem.innerText = `${correctPrice(
                  subtotalPrice(lineItems),
                  fractionDigits,
                )}`;
              }
            } else {
              console.log("Cart empty");
              if (cartBlock && emptyCartBlock) {
                cartBlock.classList.add("cart__wrapper--hidden");
                emptyCartBlock.classList.remove("cart__empty-cart--hidden");
              }
            }
            sessionStorage.setItem(
              "totalCart",
              String(this.totalQuantity(lineItems)),
            );
            CartIco.checkCart();
          }
        } else {
          throw new Error("Something is wrong");
        }
      }
    } catch (err) {
      Alert.showAlert(true, "Item not removed");
      console.log(err);
    }
  }

  private editProduct(target: HTMLElement): void {
    const parent: HTMLElement | null = target.closest(".cart__table-row");
    if (parent) {
      const counter: HTMLElement | null = parent.querySelector(".counter");
      if (counter) {
        if (counter.classList.contains("read-only")) {
          counter.classList.remove("read-only");
        } else {
          counter.classList.add("read-only");
        }
      }
    }
  }

  private decrementValue(target: HTMLElement): void {
    const quantityInput: ChildNode | null = target.nextElementSibling;
    if (quantityInput) {
      const incrementBtn: ChildNode | null = (quantityInput as HTMLElement)
        .nextElementSibling;
      let quantityVal = Number((quantityInput as HTMLInputElement).value);
      if (quantityVal > 1) {
        if (incrementBtn)
          (incrementBtn as HTMLElement).removeAttribute("disabled");
        quantityVal -= 1;
        (quantityInput as HTMLInputElement).value = String(quantityVal);
        this.updateQuantity(quantityVal, target);
      } else {
        target.setAttribute("disabled", "disabled");
      }
    }
  }

  private incrementValue(target: HTMLElement): void {
    const quantityInput: ChildNode | null = target.previousElementSibling;
    if (quantityInput) {
      const decrementBtn: ChildNode | null = (quantityInput as HTMLElement)
        .previousElementSibling;
      let quantityVal = Number((quantityInput as HTMLInputElement).value);
      if (quantityVal < 10) {
        if (decrementBtn)
          (decrementBtn as HTMLElement).removeAttribute("disabled");
        quantityVal += 1;
        (quantityInput as HTMLInputElement).value = String(quantityVal);
        this.updateQuantity(quantityVal, target);
      } else {
        target.setAttribute("disabled", "disabled");
      }
    }
  }

  private async updateQuantity(
    quantityVal: number,
    target: HTMLElement,
  ): Promise<void> {
    const parentBlock: HTMLElement | null = target.closest(".cart__table-row");
    const subtotalElem: HTMLDivElement | null = document.querySelector(
      ".cart__subtotal-num",
    );
    try {
      const addNewItem = await CartAPI.updateProduct(this.sku, quantityVal);
      if (addNewItem) {
        if (addNewItem.statusCode !== 400) {
          const {
            lineItems,
            version,
            totalPrice: {
              centAmount: cartCentAmount,
              currencyCode: cartCurrencyCode,
              fractionDigits: cartFractionDigits,
            },
          } = addNewItem.body;
          this.version = version;
          const currentItem: LineItem = lineItems.filter(
            (elem) => elem.productKey === this.productKey,
          )[0];
          const {
            quantity,
            totalPrice: { centAmount: totalCentAmount, fractionDigits },
          } = currentItem;
          this.quantity = quantity;
          if (parentBlock) {
            const totalBlock: HTMLElement | null =
              parentBlock.querySelector(".cart__table-total");
            if (totalBlock) {
              const formattedProductTotal = Number(
                (totalCentAmount / 10 ** fractionDigits).toFixed(2),
              );
              totalBlock.innerText = `${formattedProductTotal} ${this.currencyCode}`;
            }
            totalPrice(cartCentAmount, cartFractionDigits, cartCurrencyCode);
            if (subtotalElem) {
              subtotalElem.innerText = `${correctPrice(
                subtotalPrice(lineItems),
                cartFractionDigits,
              )}`;
            }
            sessionStorage.setItem(
              "totalCart",
              String(this.totalQuantity(lineItems)),
            );
            CartIco.checkCart();
          }
        } else {
          throw new Error("Something is wrong");
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  private changeProductData(
    productKey: string,
    changedTotal: number,
    discountNum: number,
  ): void {
    if (productKey === this.productKey) {
      this.totalCentAmount = changedTotal;
      this.discountSize = discountNum;
      const currentRow: HTMLElement | null = document.getElementById(
        `${this.productKey.toLowerCase()}`,
      );
      if (currentRow) {
        const productTotalPrice: HTMLElement | null =
          currentRow.querySelector(".cart__table-total");
        const productPrice: HTMLElement | null = currentRow.querySelector(
          ".cart__table-text--prices",
        );
        if (productPrice) {
          if (discountNum !== null) {
            const discountSizeBlock: HTMLElement | null =
              productPrice.querySelector(".discount-size");
            if (!discountSizeBlock) {
              const discountBlock: HTMLSpanElement =
                document.createElement("span");
              discountBlock.className = "discount-size";
              discountBlock.innerText = `-${correctPrice(
                this.discountSize,
                this.fractionDigits,
              )} ${this.currencyCode}`;
              productPrice.append(discountBlock);
            } else {
              discountSizeBlock.innerText = `-${correctPrice(
                this.discountSize,
                this.fractionDigits,
              )} ${this.currencyCode}`;
            }
          } else {
            const discountSizeBlock: HTMLElement | null =
              productPrice.querySelector(".discount-size");
            if (discountSizeBlock) {
              discountSizeBlock.remove();
            }
          }
        }
        if (productTotalPrice) {
          productTotalPrice.innerText = `${correctPrice(
            this.totalCentAmount,
            this.fractionDigits,
          )} ${this.currencyCode}`;
        }
      }
    }
  }

  private totalQuantity(arr: LineItem[]) {
    return arr.reduce((acc: number, curr: LineItem): number => {
      const { quantity } = curr;
      return acc + quantity;
    }, 0);
  }

  private addColor(): string {
    switch (this.color) {
      case "Red":
        return "#F28598";
        break;
      case "Blue":
        return "#4254A6";
        break;
      case "Black":
        return "#000";
        break;
      case "Yellow":
        return "#F2DA91";
        break;
      default:
        return "#C4C4C4";
        break;
    }
  }
}
