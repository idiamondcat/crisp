import { DiscountedLineItemPortion } from "@commercetools/platform-sdk";
import Product from "./basketProduct";
import CartAPI from "../../../sdk/cart/cart";
import { RemoveLineFromCart, Actions, AddCode } from "../../../types/types";
import Alert from "../../alerts/alert";
import Code from "./code";
import { totalPrice, correctPrice } from "./correctPrice";
import { Emitter } from "../../utils/eventEmitter";
import { CartIco } from "../../header/indicator";
import Popap from "../../popap/popap";

async function removeCart(): Promise<void> {
  const cartBlock: HTMLElement | null =
    document.querySelector(".cart__wrapper");
  const emptyCartBlock: HTMLElement | null =
    document.querySelector(".cart__empty-cart");
  const tableBody: HTMLDivElement | null =
    document.querySelector(".cart__table-body");
  const removeArr: RemoveLineFromCart[] = [];
  try {
    const allProducts = await CartAPI.checkMyCart();
    if (allProducts) {
      const { products } = allProducts;
      if (products) {
        products.forEach((product) => {
          const { lineItemKey } = product;
          if (lineItemKey) {
            const obj: RemoveLineFromCart = {
              action: Actions.removeline,
              lineItemKey,
            };
            removeArr.push(obj);
          }
        });
        const removeAllItems = await CartAPI.clearCart(removeArr);
        if (removeAllItems) {
          if (removeAllItems.statusCode !== 400) {
            const {
              totalPrice: { centAmount, fractionDigits, currencyCode },
            } = removeAllItems.body;
            if (tableBody) {
              tableBody.innerHTML = "";
            }
            totalPrice(centAmount, fractionDigits, currencyCode);
            Alert.showAlert(false, "Сart has been emptied");
            if (cartBlock && emptyCartBlock) {
              cartBlock.classList.add("cart__wrapper--hidden");
              emptyCartBlock.classList.remove("cart__empty-cart--hidden");
            }
            sessionStorage.setItem("totalCart", String(0));
            CartIco.checkCart();
          } else {
            throw new Error("Something is wrong");
          }
        }
      }
    }
  } catch (err) {
    Alert.showAlert(true, "Cart has been not emptied");
    console.log(err);
  }
}

async function addPromocode(target: HTMLElement, currId: string) {
  const codeField: Element | null = target.previousElementSibling;
  const codesList: HTMLDivElement | null =
    document.querySelector(".cart__codes-list");
  const totalElem: HTMLSpanElement | null =
    document.querySelector(".cart__total-price");
  if (codeField) {
    const codeVal: string = (codeField as HTMLInputElement).value;
    if (codeVal !== "") {
      const addCodeObj: AddCode[] = [
        {
          action: Actions.addcode,
          code: codeVal,
        },
      ];
      try {
        const addDiscountToCart = await CartAPI.addCode(addCodeObj);
        if (addDiscountToCart) {
          if (addDiscountToCart.statusCode !== 400) {
            (codeField as HTMLInputElement).value = "";
            const {
              totalPrice: { centAmount, currencyCode, fractionDigits },
            } = addDiscountToCart.body;
            const { lineItems } = addDiscountToCart.body;
            const newCode = new Code(currId, codeVal);
            if (codesList) {
              codesList.append(newCode.createCodeElem());
            }
            lineItems.forEach((elem) => {
              const { productKey, discountedPricePerQuantity } = elem;
              if (discountedPricePerQuantity.length !== 0) {
                const {
                  discountedPrice: {
                    includedDiscounts,
                    value: { centAmount: changedTotal },
                  },
                } = elem.discountedPricePerQuantity[0];
                const sumOfDiscounts: number = includedDiscounts.reduce(
                  (acc: number, curr: DiscountedLineItemPortion): number => {
                    const {
                      discountedAmount: { centAmount: discountNum },
                    } = curr;
                    return acc + discountNum;
                  },
                  0,
                );
                Emitter.emit(
                  "updateRow",
                  productKey,
                  changedTotal,
                  sumOfDiscounts,
                );
              }
            });
            Alert.showAlert(false, "Code is successfully applied to this cart");
            if (totalElem) {
              totalPrice(centAmount, fractionDigits, currencyCode);
            }
          } else {
            throw new Error("Something is wrong");
          }
        }
      } catch (err) {
        Alert.showAlert(true, "This code is unavailable");
        console.log(err);
      }
    }
  }
}

async function applyCode(target: HTMLElement): Promise<void> {
  const codeField: Element | null = target.previousElementSibling;
  if (codeField) {
    const codeVal: string = (codeField as HTMLInputElement).value;
    if (codeVal !== "") {
      await CartAPI.getMyCarts()
        .then(async (res) => {
          if (res) {
            if (res.statusCode !== 400) {
              const { discountCodes } = res.body;
              await CartAPI.getAllCodes()
                .then(async (resp) => {
                  if (resp) {
                    if (resp.statusCode !== 400) {
                      const { results } = resp.body;
                      const currDiscount = results.filter(
                        (code) => code.code === codeVal,
                      )[0];
                      if (currDiscount) {
                        const { id } = currDiscount;
                        if (discountCodes) {
                          if (discountCodes.length !== 0) {
                            if (
                              discountCodes.some(
                                (elem) => elem.discountCode.id === id,
                              )
                            ) {
                              Alert.showAlert(
                                true,
                                "Promocode has already been added",
                              );
                            } else {
                              addPromocode(target, id);
                            }
                          } else {
                            addPromocode(target, id);
                          }
                        }
                      } else {
                        Alert.showAlert(true, "This code is unavailable");
                        (codeField as HTMLInputElement).value = "";
                      }
                    }
                  }
                })
                .catch((err) => console.log(err));
            }
          }
        })
        .catch((err) => console.log(err));
    }
  }
}

export async function createCartTable(): Promise<void> {
  const mainElem: HTMLElement | null = document.querySelector(".cart");
  const cartBlock: HTMLElement | null =
    document.querySelector(".cart__wrapper");
  const emptyCartBlock: HTMLElement | null =
    document.querySelector(".cart__empty-cart");
  const tableBody: HTMLDivElement | null =
    document.querySelector(".cart__table-body");
  const codesList: HTMLDivElement | null =
    document.querySelector(".cart__codes-list");
  const subtotalElem: HTMLDivElement | null = document.querySelector(
    ".cart__subtotal-num",
  );
  const subtotalCurrency: HTMLDivElement | null = document.querySelector(
    ".cart__subtotal-currency",
  );
  const activePopap: HTMLElement | null = document.querySelector(".popap");
  let amountNum;
  let subtotalPrice = 0;
  try {
    const cartResp = await CartAPI.checkMyCart();
    const getCartDiscounts = await CartAPI.getOrCreateMyCart();
    if (cartResp) {
      const { products, cart } = cartResp;
      const {
        totalPrice: {
          centAmount,
          currencyCode: cartcurrencyCode,
          fractionDigits: cartFractionDigits,
        },
      } = cart;
      if (cartBlock && emptyCartBlock) {
        cartBlock.classList.remove("cart__wrapper--hidden");
        emptyCartBlock.classList.add("cart__empty-cart--hidden");
      }
      if (products) {
        if (tableBody) {
          tableBody.innerHTML = "";
          products.forEach((product) => {
            const {
              sku,
              id,
              version,
              lineItemKey,
              productKey,
              name: { en: productName },
              attributes,
              price: {
                value: {
                  centAmount: defaultPrice,
                  currencyCode,
                  fractionDigits,
                },
              },
              discountedPricePerQuantity,
              images,
              quantity,
              price: { discounted },
              totalPrice: { centAmount: totalCentAmount },
            } = product;
            if (discountedPricePerQuantity.length !== 0) {
              const {
                discountedPrice: { includedDiscounts },
              } = discountedPricePerQuantity[0];
              const sumOfAllDiscounts: number = includedDiscounts.reduce(
                (acc: number, curr: DiscountedLineItemPortion): number => {
                  const {
                    discountedAmount: { centAmount: discountNum },
                  } = curr;
                  return acc + discountNum;
                },
                0,
              );
              amountNum = sumOfAllDiscounts;
            } else {
              amountNum = undefined;
            }
            if (lineItemKey && productKey && attributes && images) {
              const attributesValues = attributes.map(
                (elem) => elem.value.label,
              );
              const image: string = images.map((elem) => elem.url)[0];
              const discountedPrice: number | undefined = discounted
                ? discounted.value.centAmount
                : undefined;
              const correctDefaultPrice: number = defaultPrice;
              subtotalPrice += correctPrice(
                correctDefaultPrice * quantity,
                fractionDigits,
              );
              const newProduct = new Product(
                sku,
                version,
                id,
                lineItemKey,
                productKey,
                productName,
                attributesValues[0],
                attributesValues[1],
                correctDefaultPrice,
                image,
                quantity,
                currencyCode,
                fractionDigits,
                totalCentAmount,
                amountNum,
                discountedPrice,
              );
              tableBody.append(newProduct.createProduct());
            }
          });
        }
      }
      if (codesList) {
        codesList.innerHTML = "";
        if (getCartDiscounts) {
          const { discountCodes } = getCartDiscounts;
          if (discountCodes && discountCodes.length !== 0) {
            discountCodes.forEach(async (code) => {
              const {
                discountCode: { id },
              } = code;
              try {
                const getCode = await CartAPI.getDiscountCode(id);
                if (getCode.statusCode !== 400) {
                  const { code: codeName } = getCode.body;
                  const codeElem = new Code(id, codeName);
                  if (codesList) {
                    codesList.append(codeElem.createCodeElem());
                  }
                } else {
                  throw new Error("Something is wrong");
                }
              } catch (err) {
                console.log(err);
              }
            });
          }
        }
      }
      if (cart) {
        totalPrice(centAmount, cartFractionDigits, cartcurrencyCode);
        if (subtotalElem && subtotalCurrency) {
          subtotalElem.innerText = `${subtotalPrice}`;
          subtotalCurrency.innerText = `${cartcurrencyCode}`;
        }
      }
      if (mainElem) {
        mainElem.addEventListener("click", (e: Event) => {
          e.preventDefault();
          const { target } = e;
          if ((target as HTMLElement).tagName === "BUTTON") {
            if (
              (target as HTMLElement).classList.contains("cart__clear-cart-btn")
            ) {
              Popap.open(`<div class="popap__wrapper"><p class="popap__text">Do you want to clear your cart?
              </p><button class="btn popap__clear-btn" type="button">Clear</button>
              <button class="btn btn--light popap__cancel-btn" type="button">Cancel</button></div>`);
            } else if (
              (target as HTMLElement).classList.contains("cart__apply-code-btn")
            ) {
              applyCode(target as HTMLElement);
            }
          }
        });
      }
      if (activePopap) {
        activePopap.addEventListener("click", (e: Event) => {
          if (activePopap.classList.contains("active")) {
            e.preventDefault();
            const { target } = e;
            if (
              (target as HTMLElement).classList.contains("popap__clear-btn")
            ) {
              removeCart();
              document.body.classList.remove("lock");
              activePopap.classList.remove("active");
            } else if (
              (target as HTMLElement).classList.contains("popap__cancel-btn")
            ) {
              Popap.close();
              document.body.classList.remove("lock");
              activePopap.classList.remove("active");
            }
          }
        });
      }
    } else {
      console.log("Cart empty");
      if (cartBlock && emptyCartBlock) {
        cartBlock.classList.add("cart__wrapper--hidden");
        emptyCartBlock.classList.remove("cart__empty-cart--hidden");
      }
    }
  } catch (err) {
    console.log(err);
  }
}
