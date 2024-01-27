import {
  Attribute,
  CentPrecisionMoney,
  LineItem,
  Price,
  Image,
  LocalizedString,
  createApiBuilderFromCtpClient,
  ApiRoot,
  DiscountedLineItemPriceForQuantity,
} from "@commercetools/platform-sdk";
import { apiRoot, projectKey } from "../commercetoolsApiRoot";
import { MyTokenCache } from "../token/TokenCache";
import {
  createAnonimusClient,
  createAnonimusFlow,
} from "../createPasswordClient";
import { RemoveLineFromCart, AddCode, RemoveCode } from "../../types/types";
import { CartIco } from "../../components/header/indicator";

class CartAPI {
  public static async createCart() {
    let res;

    if (
      localStorage.getItem("token") ||
      sessionStorage.getItem("anonimToken")
    ) {
      res = await this.createCartWithToken();
    } else {
      const tokenCache = new MyTokenCache();
      const anonimClientAPI = createAnonimusFlow(tokenCache);
      const anonimClient = createAnonimusClient(anonimClientAPI);
      const anonimApiRoot: ApiRoot =
        createApiBuilderFromCtpClient(anonimClient);
      res = await this.createAnonimusCart(anonimApiRoot);

      if (res.statusCode !== 400) {
        const { token } = tokenCache.get();
        sessionStorage.setItem("anonimToken", token);
      }
    }

    return res;
  }

  private static async createCartWithToken() {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("anonimToken");

    if (!token) return null;
    const res = await apiRoot
      .withProjectKey({ projectKey })
      .me()
      .carts()
      .post({
        body: {
          currency: "USD",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .execute();
    return res;
  }

  private static async createAnonimusCart(anonimusApiRoot: ApiRoot) {
    const res = await anonimusApiRoot
      .withProjectKey({ projectKey })
      .me()
      .carts()
      .post({
        body: {
          currency: "USD",
        },
      })
      .execute();
    return res;
  }

  public static async getOrCreateMyCart() {
    const myCart = await this.getMyCarts().then(async (myCartData) => {
      if (myCartData !== null) {
        return myCartData.body;
      }
      const newCart = await this.createCart().then(
        (newCartData) => newCartData?.body,
      );
      return newCart;
    });
    return myCart;
  }

  public static async deleteCart(id: string, version: number) {
    const res = apiRoot
      .withProjectKey({ projectKey })
      .carts()
      .withId({ ID: id })
      .delete({
        queryArgs: {
          version,
        },
      })
      .execute();
    return res;
  }

  public static async getAllCarts() {
    const res = await apiRoot
      .withProjectKey({ projectKey })
      .carts()
      .get()
      .execute();
    return res;
  }

  public static async getMyCarts() {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("anonimToken");
    if (!token) return null;
    const res = await apiRoot
      .withProjectKey({ projectKey })
      .me()
      .activeCart()
      .get({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .execute();
    return res;
  }

  public static async addProduct(sku: string, quantity: number) {
    if (quantity < 0) return undefined;
    const myCart = await this.getOrCreateMyCart();
    if (!myCart) {
      return undefined;
    }
    const version = myCart?.version;
    const ID = myCart?.id;
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("anonimToken");
    const addProduct = await apiRoot
      .withProjectKey({ projectKey })
      .me()
      .carts()
      .withId({ ID })
      .post({
        body: {
          version,
          actions: [
            {
              action: "addLineItem",
              sku,
              quantity,
              key: `${sku}__cart`,
            },
          ],
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .execute()
      .then((res) => res)
      .catch((e) => {
        if (e.statusCode === 400) {
          return this.updateProduct(sku, quantity, ID, version);
        }
        throw new Error(e);
      });
    return addProduct;
  }

  // если передать quantity === 0, то продукт буден удален
  public static async updateProduct(
    sku: string,
    quantity: number,
    IDData?: string,
    versionData?: number,
  ) {
    let ID;
    let version;
    if (IDData === undefined || versionData === undefined) {
      const myCart = await this.getOrCreateMyCart();
      if (!myCart) {
        return undefined;
      }
      ID = myCart?.id;
      version = myCart?.version;
    } else {
      ID = IDData;
      version = versionData;
    }
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("anonimToken");
    const updateProduct = await apiRoot
      .withProjectKey({ projectKey })
      .me()
      .carts()
      .withId({ ID })
      .post({
        body: {
          version,
          actions: [
            {
              action: "changeLineItemQuantity",
              quantity,
              lineItemKey: `${sku}__cart`,
            },
          ],
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .execute()
      .then((res) => res)
      .catch((e) => {
        throw new Error(e);
      });
    return updateProduct;
  }

  // проверяет корзину, если нет корзины или она пуста возвращает null, иначе возвращает объект с данными продукта и корзины(общая стоимость товаров и общее количество товаров)
  // product - это map, где ключ - sku продукта. Проверить есть ли такой товар в корзине можно через map.get(key) – возвращает значение по ключу или undefined, если ключ key отсутствует.
  public static async checkMyCart() {
    if (
      !(localStorage.getItem("token") || sessionStorage.getItem("anonimToken"))
    ) {
      sessionStorage.setItem("totalCart", `${0}`);
      CartIco.checkCart();
      return null;
    }

    const myCart = await this.getMyCarts().then((res) => {
      if (!res) {
        sessionStorage.setItem("totalCart", `${0}`);
        CartIco.checkCart();
        return null;
      }
      return res.body;
    });
    if (myCart === null || myCart.lineItems.length === 0) {
      sessionStorage.setItem("totalCart", `${0}`);
      CartIco.checkCart();
      return null;
    }
    const lineItems = myCart.lineItems.reduce(
      (
        acc:
          | Map<
              string,
              {
                sku: string;
                id: string;
                version: number;
                lineItemKey: string | undefined;
                name: LocalizedString;
                quantity: number;
                productKey: string | undefined;
                price: Price;
                totalPrice: CentPrecisionMoney;
                attributes: Attribute[] | undefined;
                discountedPricePerQuantity: DiscountedLineItemPriceForQuantity[];
                images: Image[] | undefined;
              }
            >
          | undefined,
        item: LineItem,
      ) => {
        const { sku } = item.variant;
        if (sku !== undefined && acc !== undefined) {
          acc.set(sku, {
            sku,
            id: myCart.id,
            version: myCart.version,
            lineItemKey: item.key,
            name: item.name,
            quantity: item.quantity,
            productKey: item.productKey,
            price: item.price,
            totalPrice: item.totalPrice,
            attributes: item.variant.attributes,
            discountedPricePerQuantity: item.discountedPricePerQuantity,
            images: item.variant.images,
          });
        }
        return acc;
      },
      new Map(),
    );
    const cart = {
      totalPrice: myCart.totalPrice,
      totalLineItemQuantity: myCart.totalLineItemQuantity,
    };
    sessionStorage.setItem("totalCart", `${cart.totalLineItemQuantity}`);
    CartIco.checkCart();
    return { products: lineItems, cart };
  }

  public static async removeLine(
    quantity: number,
    actionObj: RemoveLineFromCart,
  ) {
    if (quantity < 0) return undefined;
    const myCart = await this.getOrCreateMyCart();
    if (!myCart) {
      return undefined;
    }
    const version: number = myCart?.version;
    const ID: string = myCart?.id;
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("anonimToken");
    return apiRoot
      .withProjectKey({ projectKey })
      .me()
      .carts()
      .withId({ ID })
      .post({
        body: {
          version,
          actions: [actionObj],
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .execute();
  }

  public static async clearCart(actionObj: RemoveLineFromCart[]) {
    const myCart = await this.getOrCreateMyCart();
    if (!myCart) {
      return undefined;
    }
    const version: number = myCart?.version;
    const ID: string = myCart?.id;
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("anonimToken");
    return apiRoot
      .withProjectKey({ projectKey })
      .me()
      .carts()
      .withId({ ID })
      .post({
        body: {
          version,
          actions: actionObj,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .execute();
  }

  public static async getDiscountCode(discountID: string) {
    return apiRoot
      .withProjectKey({ projectKey })
      .discountCodes()
      .withId({ ID: discountID })
      .get()
      .execute();
  }

  public static async getCartDiscounts() {
    return apiRoot
      .withProjectKey({ projectKey })
      .cartDiscounts()
      .get()
      .execute();
  }

  public static async getCartDiscount(id: string) {
    return apiRoot
      .withProjectKey({ projectKey })
      .cartDiscounts()
      .withId({ ID: id })
      .get()
      .execute();
  }

  public static async getAllCodes() {
    return apiRoot
      .withProjectKey({ projectKey })
      .discountCodes()
      .get()
      .execute();
  }

  public static async addCode(codeObj: AddCode[]) {
    const myCart = await this.getOrCreateMyCart();
    if (!myCart) {
      return undefined;
    }
    const version: number = myCart?.version;
    const ID: string = myCart?.id;
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("anonimToken");
    return apiRoot
      .withProjectKey({ projectKey })
      .carts()
      .withId({ ID })
      .post({
        body: {
          version,
          actions: codeObj,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .execute();
  }

  public static async removeCode(codeObj: RemoveCode[]) {
    const myCart = await this.getOrCreateMyCart();
    if (!myCart) {
      return undefined;
    }
    const version: number = myCart?.version;
    const ID: string = myCart?.id;
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("anonimToken");
    return apiRoot
      .withProjectKey({ projectKey })
      .carts()
      .withId({ ID })
      .post({
        body: {
          version,
          actions: codeObj,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .execute();
  }
}

export default CartAPI;
