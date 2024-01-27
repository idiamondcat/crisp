import {
  ApiRoot,
  createApiBuilderFromCtpClient,
} from "@commercetools/platform-sdk";
import { BadRequest, FieldTypes, Obj, Address } from "../../../types/types";
import Validate from "../../utils/validation";
import { getUser, registerUser2 } from "../../../sdk/sdk";
import { MyTokenCache } from "../../../sdk/token/TokenCache";
import {
  createClient,
  createPasswordClient,
} from "../../../sdk/createPasswordClient";
/* eslint-disable import/no-cycle */
import { routeToNotAnchor } from "../../utils/router";
/* eslint-disable import/no-cycle */
import HeaderView from "../../header/header";
import Popap from "../../popap/popap";
import CartAPI from "../../../sdk/cart/cart";

export default class Registration {
  public validationForm(target: HTMLInputElement | HTMLSelectElement): void {
    const form: HTMLFormElement | null = document.querySelector(
      ".registration__form",
    );
    if (form) form.noValidate = true;
    const validate = new Validate(target);
    if (target.tagName === "INPUT") {
      if (target.id === "password") {
        validate.validatePassword();
      } else if (target.type === FieldTypes.Text) {
        validate.validateText();
      } else if (
        target.type === FieldTypes.Password ||
        target.name === "password"
      ) {
        validate.validatePassword();
      } else if (target.type === FieldTypes.Email) {
        validate.validateEmail();
      } else if (target.type === FieldTypes.Date) {
        validate.validateAge();
      }
    } else if (target.tagName === "SELECT") {
      validate.validateSelect();
    }
  }

  public async submitForm(event: MouseEvent) {
    const form: HTMLFormElement | null = document.querySelector(
      ".registration__form",
    );
    const userData: Obj = {};
    if (form) {
      const fields = form.querySelectorAll(".form__field[required]");
      if (fields) {
        const fieldsArr: Element[] = Array.from(fields);
        fieldsArr.forEach((elem) => {
          if (
            elem.hasAttribute("readonly") ||
            elem.classList.contains("read-only")
          ) {
            elem.classList.add("valid");
          }
        });
        if (fieldsArr.every((elem) => elem.classList.contains("valid"))) {
          const data = new FormData(form);
          for (const val of data.entries()) {
            const key: string = val[0];
            const newVal: string = val[1] as string;
            userData[`${key}`] = newVal;
          }
          const {
            email,
            password,
            firstName,
            lastName,
            dateOfBirth,
            shippingCountryCode,
            shippingCity,
            shippingPostalCode,
            shippingStreetName,
            shippingBuilding,
            shippingApartment,
            shippingDefaultCheckbox,
            billingCountryCode,
            billingCity,
            billingPostalCode,
            billingStreetName,
            billingBuilding,
            billingApartment,
            billingDefaultCheckbox,
          } = userData;
          const shippingObj: Address = {
            key: "keyShippingAddress",
            country: shippingCountryCode,
            city: shippingCity,
            postalCode: shippingPostalCode,
            streetName: shippingStreetName,
            building: shippingBuilding,
            apartment: shippingApartment,
          };
          const billingObj: Address = {
            key: "keyBillingAddress",
            country: billingCountryCode,
            city: billingCity,
            postalCode: billingPostalCode,
            streetName: billingStreetName,
            building: billingBuilding,
            apartment: billingApartment,
          };
          try {
            const resp = await registerUser2(
              email,
              password,
              firstName,
              lastName,
              dateOfBirth,
              shippingObj,
              billingObj,
              shippingDefaultCheckbox,
              billingDefaultCheckbox,
            );
            if (resp.statusCode !== 400) {
              const tokenCache = new MyTokenCache();
              const clientAPI = createPasswordClient(
                email,
                password,
                tokenCache,
              );
              const client = createClient(clientAPI);
              const apiRoot: ApiRoot = createApiBuilderFromCtpClient(client);
              const respGetUser = await getUser(email, password, apiRoot);
              if (respGetUser.statusCode !== 400) {
                const { id } = resp.body.customer;
                const { token } = tokenCache.get();
                localStorage.setItem("id", id);
                localStorage.setItem("token", token);
                const createCart = await CartAPI.createCart();
                if (createCart) {
                  if (createCart.statusCode === 400) {
                    throw new Error("Cart not created");
                  }
                }
              } else {
                throw new Error("User not found!");
              }
              const popapContent = document.querySelector(".popap__content");
              if (popapContent) {
                const innerText =
                  "Registration successful. You are now logged in.";
                Popap.open(`<div>${innerText}</div>`);
              }
              setTimeout((): void => {
                Popap.close();
                document.querySelector("body")?.classList.remove("lock");
                routeToNotAnchor(event, "/");
                const newHeader = new HeaderView();
                const headerElement = newHeader.getHTMLElement();
                const header = document.querySelector("header");
                if (header && header.parentNode && headerElement) {
                  header.parentNode.replaceChild(headerElement, header);
                }
                document.querySelector("body")?.classList.remove("lock");
              }, 3 * 1000);
            } else {
              throw new Error("Something wrong");
            }
          } catch (err) {
            Popap.open(`<div>${(err as BadRequest).message}</div>`);
          }
        } else {
          fieldsArr
            .filter((elem) => !elem.classList.contains("valid"))
            .forEach((elem) => {
              this.validationForm(
                (elem as HTMLInputElement) || (elem as HTMLSelectElement),
              );
            });
        }
      }
    }
  }
}
