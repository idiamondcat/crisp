import { UpdateData, Actions } from "../../../types/types";
import Alert from "../../alerts/alert";
import { updateCustomer } from "../../../sdk/sdk";
import { Emitter } from "../../utils/eventEmitter";
import validationForm from "./validationForm";

export default class Personal {
  constructor(
    private firstName: string,
    private lastName: string,
    private dateOfBirth: string,
    private id: string,
    private version: number,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.dateOfBirth = dateOfBirth;
    this.id = id;
    this.version = version;
  }

  public createPersonal(): HTMLFormElement {
    const form: HTMLFormElement = document.createElement("form");
    form.className = "form profile__form profile__personal-form";
    form.innerHTML = `
        <fieldset class="form__section profile__form-section">
            <div class="form__form-header-wrapper">
                <legend class="form__subtitle profile__subtitle">Personal information</legend>
                <button class="edit-btn profile__personal-edit-btn" id="personal_edit_btn"></button>
            </div>
            <p class="form__wrapper">
                <label class="form__label" for="profile_name">First name</label>
                <span class="form__input-wrapper profile__input-wrapper">
                    <input class="form__field" id="profile_name" name="firstName" type="text" value="${this.firstName}" data-type="names" readonly>
                    <span class="form__message" aria-live="polite"></span>
                </span>
            </p>
            <p class="form__wrapper">
                <label class="form__label" for="profile_last-name">Last name</label>
                <span class="form__input-wrapper profile__input-wrapper">
                    <input class="form__field" id="profile_last-name" name="lastName" type="text" value="${this.lastName}" data-type="names" readonly>
                    <span class="form__message" aria-live="polite"></span>
                </span>
            </p>
            <p class="form__wrapper">
                <label class="form__label" for="profile_birthdate">Date of Birth</label>
                <span class="form__input-wrapper profile__input-wrapper">
                <input class="form__field form__date" id="profile_birthdate" name="dateOfBirth" value="${this.dateOfBirth}" type="date" readonly>
                <span class="form__message" aria-live="polite"></span>
                </span>
            </p>
        </fieldset>
        <button class="btn profile__save-btn profile__save-btn--hidden" id="personal_btn" type="submit">Save</button>
        `;
    form.addEventListener("click", (e: Event) => {
      e.preventDefault();
      const { target } = e;
      if ((target as HTMLElement).tagName === "BUTTON") {
        if ((target as HTMLElement).id === "personal_btn") {
          this.savePersonalData();
        } else if ((target as HTMLElement).id === "personal_edit_btn") {
          this.editPersonalData();
        }
      }
    });
    return form;
  }

  public async savePersonalData(): Promise<void> {
    const form: HTMLFormElement | null = document.querySelector(
      ".profile__personal-form",
    );
    if (form) {
      const fields: NodeListOf<Element> = form.querySelectorAll(".form__field");
      const fieldsArr: Element[] = Array.from(fields);
      const firstNameField: HTMLElement | null =
        document.getElementById("profile_name");
      const lastNameField: HTMLElement | null =
        document.getElementById("profile_last-name");
      const birthdateField: HTMLElement | null =
        document.getElementById("profile_birthdate");
      const updateArr: UpdateData[] = [];
      if (firstNameField && lastNameField && birthdateField) {
        if (
          (firstNameField as HTMLInputElement).value === this.firstName &&
          (lastNameField as HTMLInputElement).value === this.lastName &&
          (birthdateField as HTMLInputElement).value === this.dateOfBirth
        ) {
          this.editPersonalData();
        } else {
          const isValid: boolean = fieldsArr.every((elem): boolean =>
            elem.classList.contains("valid"),
          );
          if (isValid) {
            if ((firstNameField as HTMLInputElement).value !== this.firstName) {
              updateArr.push({
                action: Actions.firstname,
                firstName: `${(firstNameField as HTMLInputElement).value}`,
              });
            }
            if ((lastNameField as HTMLInputElement).value !== this.lastName) {
              updateArr.push({
                action: Actions.lastname,
                lastName: `${(lastNameField as HTMLInputElement).value}`,
              });
            }
            if (
              (birthdateField as HTMLInputElement).value !== this.dateOfBirth
            ) {
              updateArr.push({
                action: Actions.dateofbirth,
                dateOfBirth: `${(birthdateField as HTMLInputElement).value}`,
              });
            }
            const update = await updateCustomer(
              this.id,
              updateArr,
              this.version,
            )
              .then((res) => {
                if (res.statusCode !== 400) {
                  const { firstName, lastName, dateOfBirth, version } =
                    res.body;
                  if (firstName && lastName && dateOfBirth) {
                    this.version = version;
                    this.firstName = firstName;
                    this.lastName = lastName;
                    this.dateOfBirth = dateOfBirth;
                    Emitter.emit(
                      "updatePersonalData",
                      this.version,
                      this.firstName,
                      this.lastName,
                      this.dateOfBirth,
                    );
                  }
                  Alert.showAlert(false, "Personal data successfully updated");
                  this.updateUserData();
                  this.editPersonalData();
                } else {
                  throw new Error("Personal data not changed");
                }
              })
              .catch((err) => {
                Alert.showAlert(true, "Personal data not updated");
                console.log(err);
              });
            console.log(update);
          } else {
            fieldsArr
              .filter((elem) => !elem.classList.contains("valid"))
              .forEach((elem) => {
                validationForm(elem as HTMLInputElement);
              });
          }
        }
      }
    }
  }

  private updateUserData(): void {
    const firstNameField: HTMLElement | null =
      document.getElementById("profile_name");
    const lastNameField: HTMLElement | null =
      document.getElementById("profile_last-name");
    const birthdateField: HTMLElement | null =
      document.getElementById("profile_birthdate");
    if (firstNameField) {
      (firstNameField as HTMLInputElement).value = this.firstName;
    }
    if (lastNameField) {
      (lastNameField as HTMLInputElement).value = this.lastName;
    }
    if (birthdateField) {
      (birthdateField as HTMLInputElement).value = this.dateOfBirth;
    }
  }

  private editPersonalData(): void {
    const formElem: HTMLFormElement | null = document.querySelector(
      ".profile__personal-form",
    );
    if (formElem) {
      const fieldsArr: NodeListOf<Element> =
        formElem.querySelectorAll(".form__field");
      const saveBtn: HTMLButtonElement | null =
        formElem.querySelector("#personal_btn");
      fieldsArr.forEach((elem) => {
        if ((elem as HTMLInputElement).readOnly === true) {
          (elem as HTMLInputElement).readOnly = false;
        } else {
          (elem as HTMLInputElement).readOnly = true;
          (elem as HTMLInputElement).classList.remove("valid");
          (elem as HTMLInputElement).classList.remove("invalid");
          if ((elem as HTMLInputElement).id === "profile_name")
            (elem as HTMLInputElement).value = this.firstName;
          if ((elem as HTMLInputElement).id === "profile_last-name")
            (elem as HTMLInputElement).value = this.lastName;
          if ((elem as HTMLInputElement).id === "profile_birthdate")
            (elem as HTMLInputElement).value = this.dateOfBirth;
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
