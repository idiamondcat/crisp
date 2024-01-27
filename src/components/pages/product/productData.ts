import {
  ProductProjection,
  Image,
  TypedMoney,
  Attribute,
} from "@commercetools/platform-sdk";

export class ProductData {
  public variantAttrubutes: {
    color: string;
    size: string;
    brend: string;
    prise: string;
  }[];

  public name: string;

  public description: string;

  public skuArr: (string | undefined)[];

  public imgs: Image[] | undefined;

  public startPrice: string;

  public slides: HTMLElement[] | undefined;

  public slidesPopap: HTMLElement[] | undefined;

  public salePrice: string;

  public key: string | undefined;

  public mainAttrubutes: {
    color: string;
    size: string;
    brend: string;
    prise: string;
  };

  constructor(data: ProductProjection) {
    this.name = data.name.en;
    this.description =
      data.description?.en === undefined ? "" : data.description?.en;
    this.skuArr = [
      data.masterVariant.sku,
      ...data.variants.map((el) => el.sku),
    ];
    this.imgs = data.masterVariant.images;
    this.startPrice =
      data.masterVariant.prices === undefined ||
      data.masterVariant.prices?.length <= 0
        ? ""
        : ProductData.getPrice(data.masterVariant.prices[0].value);
    this.salePrice =
      data.masterVariant.prices === undefined ||
      data.masterVariant.prices?.length <= 0 ||
      data.masterVariant.prices[0].discounted === undefined
        ? ""
        : ProductData.getPrice(data.masterVariant.prices[0].discounted.value);
    this.mainAttrubutes = ProductData.getAttrubutes(
      data.masterVariant?.attributes,
    );
    this.variantAttrubutes = data.variants.map((variant) =>
      ProductData.getAttrubutes(variant.attributes),
    );
    this.key = data.key;

    this.slides = this.imgs?.reduce((acc: HTMLElement[], img) => {
      const el = ProductData.createSlide(`${img.url}`, "swiper-slide__content");
      acc.push(el);
      return acc;
    }, []);

    this.slidesPopap = data.masterVariant.images?.reduce(
      (acc: HTMLElement[], img) => {
        const el = ProductData.createSlide(
          `${img.url}`,
          "swiper-slide__content",
        );
        acc.push(el);
        return acc;
      },
      [],
    );
  }

  private static getPrice(data: TypedMoney | undefined) {
    if (data === undefined) return "";
    const value = (data.centAmount / 10 ** data.fractionDigits).toFixed(2);
    let { currencyCode } = data;
    if (data.currencyCode === "USD") {
      currencyCode = "$";
    }
    return value ? `${value} ${currencyCode}` : "";
  }

  private static createSlide(url: string, className: string) {
    const box = document.createElement("div");
    box.classList.add(className);
    box.innerHTML = `<img class="product_page__img" src="${url}" alt="slide"></img>`;
    return box;
  }

  private static getAttrubutes(res: Attribute[] | undefined) {
    const result = {
      color: "",
      size: "",
      brend: "",
      prise: "",
    };
    if (res !== undefined) {
      res.forEach((el) => {
        switch (el.name) {
          case "color":
            result.color = el.value.label;
            break;
          case "size":
            result.size = el.value.label;
            break;
          case "brend":
            result.brend = el.value.label;
            break;
          case "price":
            result.prise = el.value.label;
            break;
          default:
            break;
        }
      });
    }
    return result;
  }
}
