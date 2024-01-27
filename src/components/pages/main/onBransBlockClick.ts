/* eslint-disable import/no-cycle */
import { routeToNotAnchor } from "../../utils/router";
import { Cards } from "../catalog/cards";
import FilterAndSort from "../catalog/filterAndSort";

export async function onBrandsBlockClick(event: Event) {
  let clickedEl = event.target;
  if (clickedEl instanceof HTMLElement) {
    if (clickedEl.tagName === "LI") {
      const imgElement = clickedEl.querySelector(".brands__img");
      clickedEl = imgElement;
    }
  }
  if (
    clickedEl instanceof HTMLElement &&
    clickedEl.classList.contains("brands__img")
  ) {
    const callback = async () => {
      const filterBrandsBlock = document.querySelector(".aside__brends");
      const allBrends = filterBrandsBlock?.querySelectorAll(".form__checkbox");
      if (allBrends) {
        const allBrendsArr = Array.from(allBrends);
        allBrendsArr.forEach((el) => {
          if (
            clickedEl instanceof HTMLElement &&
            el.getAttribute("id") === clickedEl.getAttribute("brandId")
          ) {
            if (el instanceof HTMLInputElement) {
              el.checked = true;
            }
          }
        });
      }
      const cards = new Cards();
      const filter = new FilterAndSort();
      cards.visualeFilterCards(filter.getFilterParams());
    };
    routeToNotAnchor(event, "/catalog", callback);
  }
}
