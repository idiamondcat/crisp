import { getCategories } from "../../../sdk/sdk";
// eslint-disable-next-line import/no-cycle
import { Cards } from "./cards";
import { Categ } from "./category";

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}
export class Catalog {
  private cards: Cards;

  private categories: Categ;

  constructor() {
    this.categories = new Categ();
    this.categories.create();

    this.cards = new Cards();
    this.cards.visualeCards();
  }

  public init() {
    this.categories.container?.addEventListener("click", async (event) => {
      this.cards.filter.resetFilter();
      this.categories.reset();
      const categories: Record<string, Category> = {};
      const categoriesArr = (await getCategories()).body.results;
      categoriesArr.forEach((el) => {
        const categoryObj: Category = {
          id: el.id,
          name: el.name.en,
          parentId: `${el.parent?.id}`,
        };
        categories[el.id] = categoryObj;
      });
      const el = event.target;
      if (el instanceof HTMLElement) {
        if (el.tagName === "A") {
          const { parentElement } = el;
          if (parentElement) {
            parentElement.classList.add("selected");
          }
        } else {
          el.classList.add("selected");
        }
        const key = el.getAttribute("key");
        const categoryPathElement = document.getElementById("categoryPath");
        if (categoryPathElement && key) {
          const categoryPath = Categ.getCategoryPath(key, categories);
          categoryPathElement.textContent = categoryPath;
        }
        this.cards.visualeFilterCards([`variants.categories.id:"${key}"`]);
      }
    });
  }
}
