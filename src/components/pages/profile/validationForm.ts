import Validate from "../../utils/validation";
import { FieldTypes } from "../../../types/types";

export default function validationForm(target: HTMLInputElement): void {
  const forms: NodeListOf<HTMLFormElement> =
    document.querySelectorAll(".profile__form");
  const validate = new Validate(target);
  forms.forEach((form) => {
    if (form) {
      form.noValidate = true;
      if (target.tagName === "INPUT") {
        if (target.type === FieldTypes.Password) {
          validate.validatePassword();
        } else if (
          target.type === FieldTypes.Text &&
          target.id.includes("password")
        ) {
          validate.validatePassword();
        } else if (target.type === FieldTypes.Text) {
          validate.validateText();
        } else if (target.type === FieldTypes.Email) {
          validate.validateEmail();
        } else if (target.type === FieldTypes.Date) {
          validate.validateAge();
        }
      } else if (target.tagName === "SELECT") {
        validate.validateSelect();
      }
    }
  });
}
