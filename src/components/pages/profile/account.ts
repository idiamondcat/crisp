import { UpdateEmail, Actions } from "../../../types/types";
import Alert from "../../alerts/alert";
import { updateCustomerEmail, changeCustomerPassword } from "../../../sdk/sdk";
import { Emitter } from "../../utils/eventEmitter";
import validationForm from "./validationForm";

export default class Account {
  constructor(
    private email: string,
    private id: string,
    private version: number,
  ) {
    this.email = email;
    this.id = id;
    this.version = version;
  }

  public createAccount(): HTMLDivElement {
    const wrapper: HTMLDivElement = document.createElement("div");
    wrapper.className = "profile__forms-wrapper";
    wrapper.innerHTML = `
        <form class="form profile__form profile__email-form">
            <fieldset class="form__section profile__form-section">
                <div class="form__form-header-wrapper">
                    <legend class="form__subtitle profile__subtitle">Email</legend>
                    <button class="edit-btn" id="email_edit_btn"></button>
                </div>
                <p class="form__wrapper">
                    <label class="form__label" for="email">Email</label>
                    <span class="form__input-wrapper profile__input-wrapper">
                        <input class="form__field" id="profile_email" type="email" name="email" value="${this.email}" placeholder="daisy.watson@example.com" readonly>
                        <span class="form__message" aria-live="polite"></span>
                    </span>
                </p>
            </fieldset>
            <button class="btn profile__save-btn profile__save-btn--hidden" id="email_save_btn" type="submit">Save</button>
        </form>
        <hr class="profile__line">
        <form class="form profile__form profile__password-form">
            <fieldset class="form__section profile__form-section">
                <div class="form__form-header-wrapper">
                    <legend class="form__subtitle profile__subtitle">Password</legend>
                    <button class="edit-btn" id="password_edit_btn"></button>
                </div>
                <p class="form__wrapper">
                    <label class="form__label" for="curr-password">Current Password</label>
                    <span class="form__input-wrapper profile__input-wrapper password">
                        <input class="form__field password__input" id="profile_curr_password" name="currentPassword" type="password" readonly>
                        <span class="form__message form__message--empty" aria-live="polite">Password Strength: No Password</span>
                        <span class="password__btn"><img src="../assets/icons/211739_eye_icon.svg" alt="eye"></span>
                    </span>
                </p>
                <p class="form__wrapper">
                    <label class="form__label" for="new-password">New Password</label>
                    <span class="form__input-wrapper profile__input-wrapper password">
                        <input class="form__field password__input" id="profile_new_password" name="newPassword" type="password" readonly>
                        <span class="form__message form__message--empty" aria-live="polite">Password Strength: No Password</span>
                        <span class="password__btn"><img src="../assets/icons/211739_eye_icon.svg" alt="eye"></span>
                    </span>
                </p>
            </fieldset>
            <button class="btn profile__save-btn profile__save-btn--hidden" id="password_save_btn" type="submit">Save</button>
        </form>
        `;
    wrapper.addEventListener("click", (e: Event) => {
      e.preventDefault();
      const { target } = e;
      if ((target as HTMLElement).tagName === "BUTTON") {
        if ((target as HTMLElement).id === "email_save_btn") {
          this.changeEmail();
        } else if ((target as HTMLElement).id === "password_save_btn") {
          this.changePassword();
        } else if ((target as HTMLElement).id === "email_edit_btn") {
          this.editEmailData();
        } else if ((target as HTMLElement).id === "password_edit_btn") {
          this.editPasswordData();
        }
      }
    });
    return wrapper;
  }

  private async changeEmail(): Promise<void> {
    const emailField: HTMLElement | null =
      document.getElementById("profile_email");
    const updateEmail: UpdateEmail[] = [];
    if (emailField) {
      if ((emailField as HTMLInputElement).value !== this.email) {
        if ((emailField as HTMLInputElement).classList.contains("valid")) {
          updateEmail.push({
            action: Actions.email,
            email: `${(emailField as HTMLInputElement).value}`,
          });
          const updateToNewEmail = await updateCustomerEmail(
            this.id,
            updateEmail,
            this.version,
          )
            .then((res) => {
              if (res.statusCode !== 400) {
                Alert.showAlert(false, "Email successfully updated");
                const { email, version } = res.body;
                this.email = email;
                this.version = version;
                Emitter.emit("updateEmail", this.email, this.version);
                this.editEmailData();
                if (
                  (emailField as HTMLInputElement).classList.contains("valid")
                ) {
                  (emailField as HTMLInputElement).classList.remove("valid");
                }
              } else {
                throw new Error("Email not be added");
              }
            })
            .catch((err) => {
              Alert.showAlert(true, "Email not updated");
              console.log(err);
            });
          console.log(updateToNewEmail);
        } else {
          validationForm(emailField as HTMLInputElement);
        }
      } else {
        this.editEmailData();
      }
    }
  }

  private async changePassword(): Promise<void> {
    const currentPassword: HTMLElement | null = document.getElementById(
      "profile_curr_password",
    );
    const newPassword: HTMLElement | null = document.getElementById(
      "profile_new_password",
    );
    const currentPasswordVal: string = (currentPassword as HTMLInputElement)
      .value;
    const newPasswordVal: string = (newPassword as HTMLInputElement).value;
    if (
      (currentPassword as HTMLInputElement).classList.contains("valid") &&
      (newPassword as HTMLInputElement).classList.contains("valid")
    ) {
      const updateToNewPassword = await changeCustomerPassword(
        this.id,
        currentPasswordVal,
        newPasswordVal,
        this.version,
      )
        .then((res) => {
          if (res.statusCode !== 400) {
            Alert.showAlert(false, "Password succesfully changed");
            (currentPassword as HTMLInputElement).value = "";
            (newPassword as HTMLInputElement).value = "";
            const { version } = res.body;
            this.version = version;
            Emitter.emit("updateVersion", this.version);
            this.editPasswordData();
            if (
              (currentPassword as HTMLInputElement).classList.contains("valid")
            ) {
              (currentPassword as HTMLInputElement).classList.remove("valid");
            }
            if ((newPassword as HTMLInputElement).classList.contains("valid")) {
              (newPassword as HTMLInputElement).classList.remove("valid");
            }
          } else {
            throw new Error("Password not changed");
          }
        })
        .catch((err) => {
          Alert.showAlert(true, "Password not valid or not match with current");
          console.log(err);
        });
      console.log(updateToNewPassword);
    } else {
      const currentForm: HTMLFormElement | null = document.querySelector(
        ".profile__password-form",
      );
      if (currentForm) {
        const currentFields: NodeListOf<Element> =
          currentForm.querySelectorAll(".form__field");
        if (currentFields) {
          const fieldsArr: Element[] = Array.from(currentFields);
          fieldsArr
            .filter((elem) => !elem.classList.contains("valid"))
            .forEach((elem) => {
              validationForm(elem as HTMLInputElement);
            });
        }
      }
    }
  }

  private editEmailData(): void {
    const formElem: HTMLFormElement | null = document.querySelector(
      ".profile__email-form",
    );
    if (formElem) {
      const field: HTMLInputElement | null =
        formElem.querySelector(".form__field");
      const saveBtn: HTMLButtonElement | null =
        formElem.querySelector("#email_save_btn");
      if (field) {
        if (field.readOnly === true) {
          field.readOnly = false;
        } else {
          field.readOnly = true;
          field.classList.remove("valid");
          field.classList.remove("invalid");
          field.value = this.email;
        }
      }
      if (saveBtn) {
        if (saveBtn.classList.contains("profile__save-btn--hidden"))
          saveBtn.classList.remove("profile__save-btn--hidden");
        else saveBtn.classList.add("profile__save-btn--hidden");
      }
    }
  }

  private editPasswordData(): void {
    const formElem: HTMLFormElement | null = document.querySelector(
      ".profile__password-form",
    );
    if (formElem) {
      const fieldsArr: NodeListOf<Element> =
        formElem.querySelectorAll(".form__field");
      const saveBtn: HTMLButtonElement | null =
        formElem.querySelector("#password_save_btn");
      fieldsArr.forEach((elem) => {
        if ((elem as HTMLInputElement).readOnly === true) {
          (elem as HTMLInputElement).readOnly = false;
        } else {
          (elem as HTMLInputElement).readOnly = true;
          (elem as HTMLInputElement).classList.remove("valid");
          (elem as HTMLInputElement).classList.remove("invalid");
          (elem as HTMLInputElement).value = "";
        }
      });
      if (saveBtn) {
        if (saveBtn.classList.contains("profile__save-btn--hidden"))
          saveBtn.classList.remove("profile__save-btn--hidden");
        else saveBtn.classList.add("profile__save-btn--hidden");
      }
    }
  }
}
