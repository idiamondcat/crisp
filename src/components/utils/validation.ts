import { postcodeValidator } from "postcode-validator";

export default class Validate {
  private errorField: ChildNode | null;

  constructor(private target: HTMLInputElement | HTMLSelectElement) {
    this.target = target;
    this.errorField = this.target.nextElementSibling;
  }

  public validateText(): void {
    if (
      (!this.target.value || this.target.value === "") &&
      !this.target.id.includes("building") &&
      !this.target.id.includes("apartment")
    ) {
      this.error("This is a required field.");
    } else {
      const reg = /^[ёЁA-zА-я ]+$/;
      if (this.target.dataset.type === "code") {
        let country: HTMLElement | null;
        let countryVal: string;
        if (this.target.id === "billing_postal_code") {
          country = document.getElementById("billing_country");
          if (country) {
            countryVal = (country as HTMLSelectElement).value;
            if (this.target.value !== "") {
              if (!postcodeValidator(this.target.value, countryVal)) {
                this.error("Incorrect postcode.");
              } else {
                this.valid("Correct postcode!");
              }
            } else {
              this.error("This is a required field.");
            }
          }
        } else if (this.target.id === "shipping_postal_code") {
          country = document.getElementById("shipping_country");
          if (country) {
            countryVal = (country as HTMLSelectElement).value;
            if (this.target.value !== "") {
              if (!postcodeValidator(this.target.value, countryVal)) {
                this.error("Incorrect postcode.");
              } else {
                this.valid("Correct postcode!");
              }
            } else {
              this.error("This is a required field.");
            }
          }
        } else if (this.target.id === "postal_code") {
          country = document.getElementById("country");
          if (country) {
            countryVal = (country as HTMLSelectElement).value;
            if (this.target.value !== "") {
              if (!postcodeValidator(this.target.value, countryVal)) {
                this.error("Incorrect postcode.");
              } else {
                this.valid("Correct postcode!");
              }
            } else {
              this.error("This is a required field.");
            }
          }
        }
      } else if (
        this.target.dataset.type === "names" ||
        this.target.dataset.type === "city"
      ) {
        if (this.target.value.match(reg)) {
          this.target.value = this.target.value.replace(
            /(-| |^)[а-яёa-z]/g,
            (firstLetter) => firstLetter.toUpperCase(),
          );
          this.valid("Correct!");
        } else {
          this.error(
            "Must contain at least one character and no special characters or numbers.",
          );
        }
      } else if (this.target.dataset.type === "street") {
        const street = /^.+$/;
        if (this.target.value.match(street)) {
          this.valid("Correct street!");
        } else {
          this.error("Must be at least 1 character.");
        }
      }
    }
  }

  public validateEmail(): void {
    if (!this.target.value || this.target.value === "") {
      this.error("This is a required field.");
    } else {
      const emailReg =
        /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
      if (this.target.value.match(emailReg)) {
        this.target.value = this.target.value.trim();
        this.valid("Correct email!");
      } else {
        this.error(
          "Please enter a valid email address, e.g., user@example.com, and ensure it contains no leading or trailing whitespace, includes a domain name, and has an '@' symbol separating the local part and domain name.",
        );
      }
    }
  }

  public validatePassword(): void {
    if (!this.target.value || this.target.value === "") {
      this.error("This is a required field.");
    } else {
      const passwordReg =
        /^(?! )(?!.* $)(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-])\S{8,}$/;
      if (this.target.value.match(passwordReg)) {
        this.valid("Strong Password!");
      } else {
        this.error(
          "Your password must contain at least 8 characters, at least one uppercase and lowercase letter, digit, and special character (such as !, @, #, $), contain no spaces, and must not start or end with a whitespace character.",
        );
      }
    }
  }

  public validateAge(): void {
    if (!this.target.value && this.target.value === "") {
      this.error("This is a required field.");
    } else {
      const currDate: number = Date.now();
      const userBirth: number = new Date(this.target.value).getTime();
      const difference: number = currDate - userBirth;
      if (difference < 0) {
        this.error("Incorrect date.");
      } else {
        const userAge: number = new Date(difference).getFullYear() - 1970;
        if (userAge < 13) {
          this.error("Users under the age of 13 are not allowed to register.");
        } else {
          this.valid("Allowed age.");
        }
      }
    }
  }

  public validateSelect(): void {
    this.target.classList.remove("invalid");
    this.target.classList.add("valid");
  }

  private error(message: string): void {
    if (this.errorField) {
      this.errorField.textContent = message;
      (this.errorField as HTMLSpanElement).classList.remove(
        "form__message--empty",
      );
      (this.errorField as HTMLSpanElement).classList.remove(
        "form__message--strong",
      );
      (this.errorField as HTMLSpanElement).classList.add(
        "form__message--short",
      );
      this.target.classList.remove("valid");
      this.target.classList.add("invalid");
    }
  }

  private valid(message: string): void {
    if (this.errorField) {
      this.errorField.textContent = message;
      (this.errorField as HTMLSpanElement).classList.remove(
        "form__message--empty",
      );
      (this.errorField as HTMLSpanElement).classList.remove(
        "form__message--short",
      );
      (this.errorField as HTMLSpanElement).classList.add(
        "form__message--strong",
      );
      this.target.classList.remove("invalid");
      this.target.classList.add("valid");
    }
  }
}
