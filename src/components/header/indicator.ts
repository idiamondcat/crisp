export class CartIco {
  public static checkCart() {
    const box = document.getElementById("shoping_cart__ind");
    const total = sessionStorage.getItem("totalCart") || 0;
    if (!box || !(box instanceof HTMLElement)) return;
    if (+total <= 0) {
      box.innerHTML = "0";
      box.classList.remove("active");
    }
    if (+total > 0) {
      box.innerHTML = `${total}`;
      if (!box.classList.contains("active")) box.classList.add("active");
    }
  }
}
