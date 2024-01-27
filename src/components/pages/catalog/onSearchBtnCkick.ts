import { searchByKeyWords } from "../../../sdk/sdk";
/* eslint-disable import/no-cycle */
import Card from "./card";

export function onSearchBtnCkick() {
  const searchInput = document.getElementById("search");
  const container = document.querySelector(".catalog__products");
  const sortSelect = document.getElementById("sort-select");
  if (container) {
    container.innerHTML = "";
  }
  const checkboxArray = document.querySelectorAll(".form__checkbox");
  checkboxArray.forEach((checkbox) => {
    if (checkbox instanceof HTMLInputElement) {
      checkbox.checked = false;
    }
  });
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
  if (searchInput instanceof HTMLInputElement) {
    const keyWord = searchInput.value.toLowerCase();
    searchByKeyWords(keyWord, sortParam).then((res) => {
      const arrProducts = res.body.results;
      arrProducts.forEach((el) => {
        const name = el.name.en;
        const description = el.description?.en;
        const imagesArr = el.masterVariant.images;
        const pricesArr = el.masterVariant.prices;
        const { sku } = el.masterVariant;
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
    });
  }
}
