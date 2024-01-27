export default function showPassword() {
  const passwordBox = Array.from(document.getElementsByClassName("password"));
  passwordBox.forEach((box) => {
    const eye = box.querySelector(".password__btn");
    const input = box.querySelector(".password__input");
    eye?.addEventListener("click", () => {
      if (eye instanceof HTMLElement) eye.classList.toggle("active");
      if (input?.getAttribute("type") === "password") {
        input.setAttribute("type", "text");
      } else {
        input?.setAttribute("type", "password");
      }
    });
  });
}
