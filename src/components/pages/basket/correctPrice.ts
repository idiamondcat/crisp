import { LineItem } from "@commercetools/platform-sdk";

export function correctPrice(price: number, fractiondigits: number): number {
  const formattedPrice = Number((price / 10 ** fractiondigits).toFixed(2));
  return formattedPrice;
}
export function totalPrice(
  price: number,
  fractiondigits: number,
  currencyCode: string,
) {
  const totalElem: HTMLSpanElement | null =
    document.querySelector(".cart__total-price");
  const formattedPrice = correctPrice(price, fractiondigits);
  if (totalElem) {
    totalElem.innerText = `${formattedPrice} ${currencyCode}`;
  }
}

export function subtotalPrice(lineItems: LineItem[]): number {
  const summaryDefaultPrice: number = lineItems.reduce((acc, curr) => {
    const {
      quantity,
      price: {
        value: { centAmount: defaultSummaryCentAmount },
      },
    } = curr;
    return acc + defaultSummaryCentAmount * quantity;
  }, 0);
  return summaryDefaultPrice;
}
