import { getSerchingProducts } from "../../../sdk/sdk";
// eslint-disable-next-line import/no-cycle
import Card from "./card";

export async function visualeFilterCards(params: string[]) {
  const container = document.querySelector(".catalog__products");
  const sortSelect = document.getElementById("sort-select");
  if (container) {
    container.innerHTML = "";
  }
  let sortParam = "";
  if (sortSelect instanceof HTMLSelectElement) {
    if (sortSelect.value === "name-asc") {
      sortParam = "name.en asc";
    } else if (sortSelect.value === "name-desc") {
      sortParam = "name.en desc";
    } else if (sortSelect.value === "price-desc") {
      sortParam = "price desc";
    } else {
      sortParam = "price asc";
    }
  }
  try {
    const page = document.getElementById("number-page")?.innerText;
    let offset = 0;
    if (page) {
      if (page) {
        offset = (+page - 1) * 4;
      }
    }
    const products = await getSerchingProducts(params, sortParam, offset);
    const arrProducts = await products.body.results;
    const nextProducts = await getSerchingProducts(
      params,
      sortParam,
      offset + 4,
    );
    const arrNextProducts = await nextProducts.body.results;
    const nextBtn = document.getElementById("next");

    if (arrNextProducts.length === 0) {
      if (nextBtn) {
        nextBtn.classList.remove("catalog__button_active");
        nextBtn.classList.add("catalog__button_inactive");
      }
    } else {
      nextBtn?.classList.add("catalog__button_active");
      nextBtn?.classList.remove("catalog__button_inactive");
    }
    if (offset - 4 < 0) {
      const prevBtn = document.getElementById("prev");
      if (prevBtn) {
        prevBtn.classList.remove("catalog__button_active");
        prevBtn.classList.add("catalog__button_inactive");
      }
    }
    arrProducts.forEach((el) => {
      const name = el.name.en;
      const description = el.description?.en;
      const { sku } = el.masterVariant;
      const imagesArr = el.masterVariant.images;
      const pricesArr = el.masterVariant.prices;
      let discount: string | undefined = "";
      const { key } = el;
      if (pricesArr) {
        if (pricesArr[0]) {
          const discountData = pricesArr[0].discounted?.value;
          if (discountData) {
            discount = `${(
              discountData.centAmount /
              10 ** discountData.fractionDigits
            ).toFixed(2)}`;
          }
        }
      }

      let url = "";
      let price = "0";
      if (
        imagesArr &&
        pricesArr &&
        pricesArr?.length !== 0 &&
        imagesArr.length !== 0
      ) {
        url = imagesArr[0].url;
        const dataPrice = pricesArr[0].value;
        price = `${(
          dataPrice.centAmount /
          10 ** dataPrice.fractionDigits
        ).toFixed(2)}`;
      }
      if (description && sku) {
        const card = discount
          ? new Card(name, description, url, price, key, sku, discount)
          : new Card(name, description, url, price, key, sku);
        card.showCard(container);
      }
    });
  } catch (error) {
    console.error(`You have an error ${error}`);
  }
}
