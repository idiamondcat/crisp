import { getCategories } from "../../../sdk/sdk";

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

export class Categ {
  public container: HTMLElement | null;

  private firstCategory: HTMLElement | null;

  private itemsArr: Element[];

  constructor() {
    this.container = document.querySelector(".catalog__catigories");
    this.firstCategory = document.querySelector(
      ".catalog__breadcrumbs.topmenu li",
    );
    this.itemsArr = Array.from(
      document.getElementsByClassName("catalog__breadcrumbs-item"),
    );
  }

  public create() {
    getCategories().then((res) => {
      const elementsWithOrderHintZero = res.body.results.filter(
        (element) => element.orderHint === "0",
      );

      const submenu = document.createElement("ul");
      submenu.className = "catalog__breadcrumbs__submenu";

      elementsWithOrderHintZero.forEach((el) => {
        const subEl = Categ.createSubCategory(el.id, `${el.name.en}`);

        function createChildrens(id: string, parentEl: HTMLElement) {
          const parentMenu = document.createElement("ul");
          parentMenu.className = "catalog__breadcrumbs__submenu";
          if (res.body) {
            const children = res.body.results.filter(
              (element) => element.parent?.id === id,
            );
            children.forEach((element) => {
              const subelement = Categ.createSubCategory(
                element.id,
                element.name.en,
              );
              createChildrens(element.id, subelement);
              parentMenu.appendChild(subelement);
            });
            if (children.length !== 0) {
              parentEl.appendChild(parentMenu);
            }
          }
        }

        createChildrens(el.id, subEl);

        submenu.appendChild(subEl);
      });

      this.firstCategory?.appendChild(submenu);
    });
  }

  private static createSubCategory(key: string, name: string) {
    const subItem = document.createElement("li");
    subItem.classList.add("catalog__breadcrumbs-item");
    subItem.setAttribute("key", key);
    subItem.innerHTML = `<a class="catalog__breadcrumbs-link" key="${key}">${name}</a>`;
    return subItem;
  }

  public reset() {
    this.itemsArr.forEach((el) => el.classList.remove("selected"));
  }

  public static getCategoryPath(
    selectedCategoryId: string,
    categories: Record<string, Category>,
  ): string {
    const selectedCategory = categories[selectedCategoryId];

    if (!selectedCategory) {
      return "";
    }

    const path: Category[] = [selectedCategory];
    let { parentId } = selectedCategory;
    while (parentId) {
      const parentCategory = categories[parentId];
      if (parentCategory) {
        path.unshift(parentCategory);
        parentId = parentCategory.parentId;
      } else {
        break;
      }
    }

    return path.map((category) => category.name).join(" / ");
  }
}
