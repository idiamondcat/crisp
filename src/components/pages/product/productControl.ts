import CartAPI from "../../../sdk/cart/cart";

export class ProductControl {
  public plus: Element | null;

  public minus: Element | null;

  public num: Element | HTMLInputElement | null;

  private sku: string;

  private addBtn?: Element | null;

  private box: HTMLElement | null | undefined;

  constructor(
    plus: Element | null,
    num: HTMLInputElement | Element | null,
    minis: Element | null,
    sku: string | null,
    addBtn?: Element | null,
  ) {
    if (!sku) throw new Error("sku is null");
    if (sku === "") throw new Error("set sku");
    this.plus = plus;
    this.num = num;
    this.minus = minis;
    this.sku = sku;
    if (plus) {
      this.box = plus.parentElement;
    }
    if (addBtn) {
      this.addBtn = addBtn;
    }
  }

  public async inite() {
    await this.updateNum();
    this.clickMinus();
    this.clickPlus();
    this.clickAddBtn();
  }

  public async updateNum() {
    this.startLoading();
    const currentNum = await this.getNumfromCart();
    if (this.num && this.num instanceof HTMLInputElement) {
      this.num.value = `${currentNum}`;
    }
    this.check(currentNum);
    this.finishLoading();
  }

  public async changeSku(value: string) {
    if (!value) throw new Error("sku is null");
    if (value === "") throw new Error("set sku");
    this.sku = value;
    await this.updateNum();
  }

  public async getNumfromCart() {
    const cartData = await CartAPI.checkMyCart();
    if (cartData === null || cartData.products === undefined) return 0;
    const num = cartData.products.get(this.sku);
    if (num === undefined) return 0;
    return num.quantity;
  }

  public clickPlus() {
    this.plus?.addEventListener("click", async () => {
      this.startLoading();
      const currentNum = await this.getNumfromCart();
      if (currentNum === 0) {
        const res = await CartAPI.addProduct(this.sku, currentNum + 1);
        if (res?.statusCode === 200) {
          await this.updateNum();
        }
        this.finishLoading();
      }
      const res = await CartAPI.updateProduct(this.sku, currentNum + 1);
      if (res?.statusCode === 200) {
        await this.updateNum();
      }
      this.finishLoading();
    });
  }

  public clickMinus() {
    this.minus?.addEventListener("click", async () => {
      this.startLoading();
      const currentNum = await this.getNumfromCart();
      if (currentNum === 0) {
        this.finishLoading();
        return;
      }
      const res = await CartAPI.updateProduct(this.sku, currentNum - 1);
      if (res?.statusCode === 200) {
        await this.updateNum();
      }
      await this.updateNum();
      this.finishLoading();
    });
  }

  public clickAddBtn() {
    if (!this.addBtn) return;
    this.addBtn.addEventListener("click", async () => {
      this.startLoading();
      const currentNum = await this.getNumfromCart();
      if (currentNum > 0) {
        const res = await CartAPI.updateProduct(this.sku, 0);
        if (res?.statusCode === 200) {
          await this.updateNum();
        }
      }
      if (currentNum === 0) {
        const res = await CartAPI.addProduct(this.sku, 1);
        if (res?.statusCode === 200) {
          await this.updateNum();
        }
      }
      this.finishLoading();
    });
  }

  public async check(num: number) {
    if (!this.addBtn) return;
    if (num === 0 && this.addBtn.classList.contains("remove")) {
      this.addBtn.classList.remove("remove");
    } else if (num > 0 && !this.addBtn.classList.contains("remove")) {
      this.addBtn.classList.add("remove");
    }
  }

  private startLoading() {
    if (this.box && !this.box.classList.contains("loading")) {
      this.box.classList.add("loading");
    }
    this.addBtn?.classList.add("loading");
  }

  private finishLoading() {
    if (this.box && this.box.classList.contains("loading")) {
      this.box.classList.remove("loading");
    }
    this.addBtn?.classList.remove("loading");
  }
}
