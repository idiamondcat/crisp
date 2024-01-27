import { ProductProjection } from "@commercetools/platform-sdk";
import { getSerchingProducts, searchByKeyWords } from "../../../sdk/sdk";
// eslint-disable-next-line import/no-cycle
import Card from "./card";
import { ProductData } from "../product/productData";
import FilterAndSort from "./filterAndSort";

export class Cards {
  private container: HTMLElement | null;

  public filter: FilterAndSort;

  private filterBtn: HTMLElement | null;

  private resetBtn: HTMLElement | null;

  private searchKeywordsBtn: HTMLElement | null;

  public pagination: {
    numBox: HTMLElement | null;
    nextBtn: HTMLElement | null;
    prevBtn: HTMLElement | null;
    readonly currentPage: number | null;
    readonly limit: number;
    readonly offset: number;
    setCurrentPage: (value: number) => void;
  };

  constructor() {
    this.container = document.querySelector(".catalog__products");
    if (!this.container) throw new Error(".catalog__products is not found");

    this.pagination = {
      numBox: document.getElementById("number-page"),
      nextBtn: document.getElementById("next"),
      prevBtn: document.getElementById("prev"),
      limit: 4,
      get currentPage() {
        if (!this.numBox) return null;
        return Number(this.numBox?.innerText);
      },
      setCurrentPage(value) {
        if (!this.numBox) return;
        this.numBox.innerText = `${value}`;
      },
      get offset() {
        return this.currentPage ? (this.currentPage - 1) * this.limit : 0;
      },
    };
    this.pagination.nextBtn?.addEventListener("click", () => {
      if (
        this.pagination.nextBtn?.classList.contains("catalog__button_active")
      ) {
        this.pagination.prevBtn?.classList.add("catalog__button_active");
        this.pagination.prevBtn?.classList.remove("catalog__button_inactive");
        if (this.pagination.currentPage) {
          this.pagination.setCurrentPage(this.pagination.currentPage + 1);
        }
        this.visualeFilterCards(this.filter.getFilterParams());
      }
    });
    this.pagination.prevBtn?.addEventListener("click", () => {
      if (
        this.pagination.prevBtn?.classList.contains("catalog__button_active")
      ) {
        this.pagination.nextBtn?.classList.add("catalog__button_active");
        this.pagination.nextBtn?.classList.remove("catalog__button_inactive");
        if (this.pagination.currentPage) {
          this.pagination.setCurrentPage(this.pagination.currentPage - 1);
        }
        this.visualeFilterCards(this.filter.getFilterParams());
      }
    });

    this.filter = new FilterAndSort();

    this.resetBtn = document.getElementById("resetBtn");
    this.resetBtn?.addEventListener("click", () => this.visualeCards());

    this.filterBtn = document.getElementById("filterBtn");
    this.filterBtn?.addEventListener("click", () => {
      this.pagination.setCurrentPage(1);
      this.visualeFilterCards(this.filter.getFilterParams());
    });

    this.searchKeywordsBtn = document.getElementById("search-button");
    this.searchKeywordsBtn?.addEventListener("click", () => {
      this.pagination.setCurrentPage(1);
      this.onSearchBtnCkick();
    });

    this.filter.sort.box?.addEventListener("change", () => {
      if (this.container) {
        this.container.innerHTML = "";
        this.visualeFilterCards(this.filter.getFilterParams());
      }
    });
  }

  public visualeCards() {
    try {
      this.filter.resetFilter();
      const sortParam = this.filter.sort.getParam();
      const params: string[] = [];
      const currentCategoryParam = this.filter.category.getParam();
      if (currentCategoryParam) params.push(currentCategoryParam);

      const { offset } = this.pagination;

      getSerchingProducts(params, sortParam, offset).then((res) => {
        const arrProducts = res.body.results;
        this.showCards(arrProducts);
      });
    } catch (error) {
      console.error(`You have an error ${error}`);
    }
  }

  public async visualeFilterCards(params: string[]) {
    try {
      const sortParam = this.filter.sort.getParam();

      const { offset } = this.pagination;

      const arrProducts = (await getSerchingProducts(params, sortParam, offset))
        .body.results;
      const arrNextProducts = (
        await getSerchingProducts(params, sortParam, offset + 4)
      ).body.results;

      if (arrNextProducts.length === 0) {
        if (this.pagination.nextBtn) {
          this.pagination.nextBtn.classList.remove("catalog__button_active");
          this.pagination.nextBtn.classList.add("catalog__button_inactive");
        }
      } else {
        this.pagination.nextBtn?.classList.add("catalog__button_active");
        this.pagination.nextBtn?.classList.remove("catalog__button_inactive");
      }
      if (offset - 4 < 0) {
        const prevBtn = document.getElementById("prev");
        if (prevBtn) {
          prevBtn.classList.remove("catalog__button_active");
          prevBtn.classList.add("catalog__button_inactive");
        }
      }

      this.showCards(arrProducts);
    } catch (error) {
      console.error(`You have an error ${error}`);
    }
  }

  public onSearchBtnCkick() {
    const searchInput = document.getElementById("search");

    const checkboxArray = document.querySelectorAll(".form__checkbox");
    checkboxArray.forEach((checkbox) => {
      if (checkbox instanceof HTMLInputElement) {
        checkbox.checked = false;
      }
    });
    const sortParam = this.filter.sort.getParam();
    if (searchInput instanceof HTMLInputElement) {
      const keyWord = searchInput.value.toLowerCase();
      searchByKeyWords(keyWord, sortParam).then((res) => {
        const arrProducts = res.body.results;
        this.showCards(arrProducts);
      });
    }
  }

  public showCards(arrProducts: ProductProjection[]) {
    if (!this.container) return;
    this.container.innerHTML = "";

    arrProducts.forEach((el) => {
      const product = new ProductData(el);
      if (product.skuArr[0]) {
        const card =
          product.salePrice !== ""
            ? new Card(
                product.name,
                product.description,
                product.imgs ? product.imgs[0].url : undefined,
                product.startPrice,
                product.key,
                product.skuArr[0],
                product.salePrice,
              )
            : new Card(
                product.name,
                product.description,
                product.imgs ? product.imgs[0].url : undefined,
                product.startPrice,
                product.key,
                product.skuArr[0],
              );
        card.showCard(this.container);
      }
    });
  }
}
