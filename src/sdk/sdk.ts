import { ApiRoot } from "@commercetools/platform-sdk";
import { apiRoot, projectKey } from "./commercetoolsApiRoot";
import {
  Address,
  UpdateData,
  UpdateEmail,
  ChangeAddress,
  RemoveAddress,
  Tuple,
  SetDefaultBilling,
  SetDefaultShipping,
} from "../types/types";

export function getProjectDetails() {
  return apiRoot.withProjectKey({ projectKey }).get().execute();
}

export function getCustomers() {
  return apiRoot.withProjectKey({ projectKey }).customers().get().execute();
}

export function registerUser(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  countryCode: string,
  key?: string,
) {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .post({
      body: {
        email,
        password,
        key,
        firstName,
        lastName,
        addresses: [
          {
            country: countryCode,
          },
        ],
        defaultShippingAddress: 0,
      },
    })
    .execute();
}

export function getUserById(id: string) {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: id })
    .get()
    .execute();
}

export function getUser(
  email: string,
  password: string,
  passwordApiRoot: ApiRoot,
) {
  return passwordApiRoot
    .withProjectKey({ projectKey })
    .me()
    .login()
    .post({
      body: {
        email,
        password,
        updateProductData: true,
      },
    })
    .execute();
}
export function registerUser2(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  dateOfBirth: string,
  address1: Address,
  address2: Address,
  shippingDefaultCheckbox: string,
  billingDefaultCheckbox: string,
) {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .post({
      body: {
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        addresses: [address1, address2],
        shippingAddresses: [0],
        billingAddresses: [1],
        defaultShippingAddress:
          shippingDefaultCheckbox === "on" ? 0 : undefined,
        defaultBillingAddress: billingDefaultCheckbox === "on" ? 1 : undefined,
      },
    })
    .execute();
}
export function updateCustomer(
  id: string,
  customersUpdate: UpdateData[],
  version: number,
) {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: id })
    .post({
      body: {
        version,
        actions: customersUpdate,
      },
    })
    .execute();
}
export function updateCustomerEmail(
  id: string,
  customersUpdate: UpdateEmail[],
  version: number,
) {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: id })
    .post({
      body: {
        version,
        actions: customersUpdate,
      },
    })
    .execute();
}
export function changeCustomerPassword(
  id: string,
  currentpassword: string,
  newpassword: string,
  version: number,
) {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .password()
    .post({
      body: {
        id,
        version,
        currentPassword: currentpassword,
        newPassword: newpassword,
      },
    })
    .execute();
}
export function changeAddress(
  version: number,
  id: string,
  addressObj: ChangeAddress[],
) {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: id })
    .post({
      body: {
        version,
        actions: addressObj,
      },
    })
    .execute();
}
export function addAddress(version: number, id: string, addressObj: Tuple) {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: id })
    .post({
      body: {
        version,
        actions: addressObj,
      },
    })
    .execute();
}
export function deleteAddress(
  version: number,
  id: string,
  addressObj: RemoveAddress[],
) {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: id })
    .post({
      body: {
        version,
        actions: addressObj,
      },
    })
    .execute();
}
export function setDefaultAddress(
  version: number,
  id: string,
  addressObj: SetDefaultShipping[] | SetDefaultBilling[],
) {
  return apiRoot
    .withProjectKey({ projectKey })
    .customers()
    .withId({ ID: id })
    .post({
      body: {
        version,
        actions: addressObj,
      },
    })
    .execute();
}

export async function getSerchingProducts(
  filterParams: string[],
  sortParam: string,
  page: number,
) {
  return apiRoot
    .withProjectKey({ projectKey })
    .productProjections()
    .search()
    .get({
      queryArgs: {
        filter: filterParams,
        sort: sortParam,
        limit: 4,
        offset: page,
      },
    })
    .execute();
}

export function getProducts() {
  return apiRoot.withProjectKey({ projectKey }).products().get().execute();
}

export function getProductsProdections() {
  return apiRoot
    .withProjectKey({ projectKey })
    .productProjections()
    .search()
    .get()
    .execute();
}
export async function getProduct(key: string) {
  const res = apiRoot
    .withProjectKey({ projectKey })
    .productProjections()
    .withKey({ key })
    .get()
    .execute();
  return res;
}

export async function getCategories() {
  return apiRoot.withProjectKey({ projectKey }).categories().get().execute();
}

export function searchByKeyWords(word: string, sortParam: string) {
  return apiRoot
    .withProjectKey({ projectKey })
    .productProjections()
    .search()
    .get({
      queryArgs: {
        fuzzy: true,
        "text.en": word,
        sort: sortParam,
      },
    })
    .execute();
}
