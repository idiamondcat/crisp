// import { DiscountedLineItemPortion } from "@commercetools/platform-sdk";
import CartAPI from "../../../sdk/cart/cart";
import { Actions, RemoveCode } from "../../../types/types";
import Alert from "../../alerts/alert";
import { Emitter } from "../../utils/eventEmitter";
import { totalPrice } from "./correctPrice";

export default class Code {
  constructor(
    private id: string,
    private name: string,
  ) {
    this.id = id;
    this.name = name;
  }

  public createCodeElem(): HTMLDivElement {
    const codeBlock: HTMLDivElement = document.createElement("div");
    const codeText: HTMLSpanElement = document.createElement("span");
    const removeCodeBtn: HTMLButtonElement = document.createElement("button");
    codeBlock.className = "code-elem cart__codes-item";
    codeText.classList.add("code-elem__text");
    codeText.innerText = `Code "${this.name}" was applied`;
    removeCodeBtn.className = "delete-btn code-elem__remove-btn";
    codeBlock.append(codeText, removeCodeBtn);
    codeBlock.addEventListener("click", async (e: Event) => {
      const { target } = e;
      if ((target as HTMLElement).tagName === "BUTTON") {
        if (
          (target as HTMLElement).classList.contains("code-elem__remove-btn")
        ) {
          const removeCodeObj: RemoveCode[] = [
            {
              action: Actions.removecode,
              discountCode: {
                typeId: "discount-code",
                id: this.id,
              },
            },
          ];
          try {
            const removeCurrCode = await CartAPI.removeCode(removeCodeObj);
            if (removeCurrCode) {
              if (removeCurrCode.statusCode !== 400) {
                const {
                  totalPrice: { centAmount, currencyCode, fractionDigits },
                  lineItems,
                } = removeCurrCode.body;
                lineItems.forEach((elem) => {
                  const {
                    productKey,
                    totalPrice: { centAmount: itemTotalAmount },
                    discountedPricePerQuantity,
                  } = elem;
                  let discountAmount;
                  if (discountedPricePerQuantity.length !== 0) {
                    const {
                      discountedPrice: { includedDiscounts },
                    } = elem.discountedPricePerQuantity[0];
                    const {
                      discount: { typeId },
                      discountedAmount: { centAmount: discountNum },
                    } = includedDiscounts[0];
                    discountAmount = discountNum;
                    if (typeId === "cart-discount") {
                      Emitter.emit(
                        "updateRow",
                        productKey,
                        itemTotalAmount,
                        discountAmount,
                      );
                    }
                  } else {
                    discountAmount = null;
                    Emitter.emit(
                      "updateRow",
                      productKey,
                      itemTotalAmount,
                      discountAmount,
                    );
                  }
                });
                totalPrice(centAmount, fractionDigits, currencyCode);
                codeBlock.remove();
                Alert.showAlert(false, `Code ${this.name} was removed`);
              } else {
                throw new Error("Something is wrong");
              }
            }
          } catch (err) {
            Alert.showAlert(true, `Code ${this.name} wasn't removed`);
            console.log(err);
          }
        }
      }
    });
    return codeBlock;
  }
}
