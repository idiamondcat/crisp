import {
  createApiBuilderFromCtpClient,
  ApiRoot,
} from "@commercetools/platform-sdk";
import { Obj, FieldTypes, BadRequest } from "../../../types/types";
import Validate from "../../utils/validation";
import { getUser } from "../../../sdk/sdk";
import Popap from "../../popap/popap";
/* eslint-disable import/no-cycle */
import { routeToNotAnchor } from "../../utils/router";
import {
  createPasswordClient,
  createClient,
} from "../../../sdk/createPasswordClient";
import { MyTokenCache } from "../../../sdk/token/TokenCache";
/* eslint-disable import/no-cycle */
import HeaderView from "../../header/header";

export default class Login {
  public validationForm(target: HTMLInputElement): void {
    const form: HTMLFormElement | null = document.querySelector(".login__form");
    if (form) form.noValidate = true;
    const validate = new Validate(target);
    if (target.tagName === "INPUT") {
      if (target.type === FieldTypes.Email) {
        validate.validateEmail();
      } else if (
        target.type === FieldTypes.Password ||
        target.name === "password"
      ) {
        validate.validatePassword();
      }
    }
  }

  public async signIn(event: MouseEvent): Promise<void> {
    const form: HTMLFormElement | null = document.querySelector(".login__form");
    const userData: Obj = {};
    if (form) {
      const fields = form.querySelectorAll(".form__field[required]");
      if (fields) {
        const fieldsArr: Element[] = Array.from(fields);
        if (fieldsArr.every((elem) => elem.classList.contains("valid"))) {
          const data = new FormData(form);
          for (const [key, value] of data.entries()) {
            userData[`${key}`] = `${value}`;
          }
          const { email, password } = userData;
          const tokenCache = new MyTokenCache();
          const clientAPI = createPasswordClient(email, password, tokenCache);
          const client = createClient(clientAPI);
          const apiRoot: ApiRoot = createApiBuilderFromCtpClient(client);
          try {
            const resp = await getUser(email, password, apiRoot);
            if (resp.statusCode !== 400) {
              const { id } = resp.body.customer;
              const { token } = tokenCache.get();
              localStorage.setItem("token", token);
              localStorage.setItem("id", id);
              sessionStorage.removeItem("anonimToken");
              const popapContent = document.querySelector(".popap__content");
              if (popapContent) {
                const innerText = "Log in is successful";
                Popap.open(`<div>${innerText}</div>`);
              }
              setTimeout((): void => {
                Popap.close();
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
              throw new Error("User not found!");
            }
          } catch (err) {
            Popap.open(`<div>${(err as BadRequest).message}</div>`);
          }
        } else {
          fieldsArr
            .filter((elem) => !elem.classList.contains("valid"))
            .forEach((elem) => {
              this.validationForm(elem as HTMLInputElement);
            });
        }
      }
    }
  }
}
