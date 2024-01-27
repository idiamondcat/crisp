import Swiper from "swiper";
import { getProduct } from "../../../sdk/sdk";
import Popap from "../../popap/popap";
import {
  productPageSwiperMainSetting,
  productPageSwiperPopapSetting,
} from "../../slider/swiper";
import { productPopap } from "./productPopap";
import { ProductControl } from "./productControl";
import { ProductData } from "./productData";

export class Product {
  private DOM: { [key: string]: HTMLElement | null };

  private key: string;

  private productControl: ProductControl | null;

  constructor(keyData = "") {
    this.DOM = {
      conteiner: document.querySelector(".product_page"),
      name: document.querySelector(".product_page__name"),
      productBreadcrumbs: document.querySelector(".breadcrumbs li:last-child"),
      description: document.querySelector(".product_deail__description"),
      quantityMinus: document.querySelector(".product_quantity__minus"),
      quantityPlus: document.querySelector(".product_quantity__plus"),
      quantityNum: document.querySelector(".product_quantity__num"),
      imgs: document.querySelector(".product_page__slider-main"),
      sliderMain: document.querySelector(".product_page__slider-main"),
      brend: document.querySelector(".product_page__brand .value"),
      colorBox: document.querySelector(".product_page__color"),
      color: document.querySelector(
        ".product_page__color .product_item__value",
      ),
      sizes: document.querySelector(".product_page__items.sizes"),
      startPrise: document.querySelector(".sizes__item.product_page__prise"),
      salePrise: document.querySelector(".product_page__sale_prise"),
      sku: document.querySelector(".sku_value"),
      addBagBtn: document.querySelector(".product_page__btn.bag"),
    };
    this.key = keyData === "" ? Product.checkURL() : keyData;
    if (this.DOM.conteiner) {
      this.DOM.conteiner.style.opacity = "0";
    }

    this.productControl = null;
  }

  private getCurrentSkuValue() {
    return this.DOM.sku?.innerText || "";
  }

  private static checkURL() {
    const value = window.location.href.split("/").slice(-1).join("");
    if (value.startsWith("product__")) {
      return value.replace("product__", "");
    }
    return "";
  }

  private async getData() {
    const resp = (await getProduct(this.key)).body;
    const data = new ProductData(resp);
    return data;
  }

  public async show() {
    const data = await this.getData();
    const productPageSwiperMain = new Swiper(
      ".product_page__swiper-main",
      productPageSwiperMainSetting,
    );
    Product.showContent(this.DOM.name, data.name);
    Product.showContent(this.DOM.productBreadcrumbs, data.name);
    Product.showContent(this.DOM.description, data.description);
    Product.showContent(this.DOM.brend, data.mainAttrubutes.brend);
    Product.showContent(this.DOM.color, data.mainAttrubutes.color);
    Product.showContent(this.DOM.sku, data.skuArr[0]);
    Product.showContent(this.DOM.startPrise, data.startPrice);
    Product.showContent(this.DOM.salePrise, data.salePrice);
    Product.checkPrice(this.DOM.startPrise, this.DOM.salePrise);

    Product.createSlides(data.slides, productPageSwiperMain);
    Product.clickSlide(
      this.DOM.sliderMain,
      data.slidesPopap,
      productPageSwiperMain,
    );

    Product.createSizes(
      this.DOM.sizes,
      data.mainAttrubutes,
      data.variantAttrubutes,
      data.skuArr,
    );
    // Product.clickAddBagBtn(this.DOM.addBagBtn, this.DOM.quantityNum);

    if (this.DOM.conteiner) {
      this.DOM.conteiner.style.opacity = "1";
    }

    if (this.DOM.quantityPlus) {
      this.productControl = new ProductControl(
        this.DOM.quantityPlus,
        this.DOM.quantityNum,
        this.DOM.quantityMinus,
        this.getCurrentSkuValue(),
        this.DOM.addBagBtn,
      );
      await this.productControl.inite();
    }

    await this.clickSizes();
  }

  private static createSlides(
    slideContent: HTMLElement[] | undefined,
    slider: Swiper,
  ) {
    if (slideContent === undefined) return;
    const slides = slideContent?.map((el) => {
      const box = document.createElement("div");
      box.classList.add("swiper-slide");
      box.append(el);
      return box;
    });
    if (slides !== undefined) {
      slider.appendSlide(slides);
    }
  }

  private static clickSlide(
    slider: Element | null,
    data: HTMLElement[] | undefined,
    mainSlider: Swiper | Swiper[] | undefined,
  ) {
    slider?.addEventListener("click", (e) => {
      if (
        e.target instanceof HTMLElement &&
        e.target.classList.contains("product_page__img") &&
        mainSlider !== undefined &&
        mainSlider instanceof Swiper
      ) {
        const activeSlide = mainSlider.activeIndex;
        productPageSwiperPopapSetting.initialSlide = activeSlide;

        Popap.open(productPopap);
        const productPageSwiperPopap = new Swiper(
          ".product_page__swiper-popap",
          productPageSwiperPopapSetting,
        );
        productPageSwiperPopap.update();
        Product.createSlides(data, productPageSwiperPopap);
        productPageSwiperPopap.controller.control = mainSlider;
      }
    });
  }

  private static showContent(domEl: Element | null, data: string | undefined) {
    if (!(domEl instanceof HTMLElement) || !domEl) return;
    if (data === undefined) {
      domEl.textContent = "";
      domEl.style.display = "none";
      return;
    }
    domEl.textContent = data;
  }

  private static createSizes(
    box: Element | null,
    main: { color: string; size: string; brend: string; prise: string },
    variant: { color: string; size: string; brend: string; prise: string }[],
    skuArr: (string | undefined)[],
  ) {
    if (!box) return;
    const elements = [main, ...variant];
    if (elements.length === 0 && box.parentElement instanceof HTMLElement) {
      box.parentElement.style.display = "none";
    }
    elements.forEach((attributes, index) => {
      const el = document.createElement("li");
      if (skuArr[index] !== undefined) {
        el.setAttribute("sku", `${skuArr[index]}`);
      }
      el.classList.add("sizes__item");
      if (index === 0) {
        el.classList.add("active");
      }
      el.textContent = attributes.size;
      box.append(el);
    });
  }

  private static checkPrice(priseBox: Element | null, saleBox: Element | null) {
    if (!priseBox && !saleBox) return;
    if (saleBox?.textContent === "" && priseBox?.classList.contains("sale")) {
      priseBox?.classList.remove("sale");
    } else if (!priseBox?.classList.contains("sale")) {
      priseBox?.classList.add("sale");
    }
  }

  private async clickSizes() {
    if (!(this.DOM.sizes instanceof HTMLElement)) return;
    this.DOM.sizes.addEventListener("click", async (e) => {
      if (
        !this.DOM.sizes ||
        !(e.target instanceof HTMLElement) ||
        !e.target.classList.contains("sizes__item") ||
        !(this.DOM.sizes instanceof HTMLElement)
      )
        return;
      Array.from(this.DOM.sizes.getElementsByClassName("sizes__item")).forEach(
        (el) => {
          if (el.classList.contains("active")) el.classList.remove("active");
        },
      );
      if (!e.target.classList.contains("active"))
        e.target.classList.add("active");
      const skuValue = e.target.getAttribute("sku");
      if (this.DOM.sku && skuValue) {
        this.DOM.sku.textContent = skuValue;
        await this.productControl?.changeSku(skuValue);
      }
    });
  }

  // private static clickAddBagBtn(
  //   btn: Element | null,
  //   quantityNum: Element | null,
  // ) {
  //   if (!btn || !(quantityNum instanceof HTMLInputElement)) return;
  //   btn.addEventListener("click", () => {
  //     if (quantityNum && btn.classList.contains("remove")) {
  //       quantityNum.value = `0`;
  //     }
  //     btn.classList.toggle("remove");
  //   });
  // }

  private static getElemText(box: Element | null) {
    if (box) {
      return box.textContent;
    }
    return "";
  }
}
