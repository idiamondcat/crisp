export enum FieldTypes {
  Text = "text",
  Password = "password",
  Email = "email",
  Date = "date",
}
export type Obj = Record<string, string>;

export interface BadRequest {
  body: object;
  headers: object;
  originalRequest: object;
  code: number;
  statusCode: number;
  status: number;
  message: string;
  name: string;
}
export interface Address {
  id?: string | undefined;
  key: string;
  country: string;
  city: string;
  postalCode: string;
  streetName: string;
  building?: string | undefined;
  apartment?: string | undefined;
}
export interface AddressData {
  countryCode: string;
  streetName: string;
  building: string;
  apartment: string;
  city: string;
  postalCode: string;
}
export interface UpdateData {
  action: Actions.firstname | Actions.lastname | Actions.dateofbirth;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  email?: string;
}
export enum Actions {
  firstname = "setFirstName",
  lastname = "setLastName",
  dateofbirth = "setDateOfBirth",
  email = "changeEmail",
  address = "changeAddress",
  removeaddress = "removeAddress",
  addaddress = "addAddress",
  addshippingaddress = "addShippingAddressId",
  addbillingaddress = "addBillingAddressId",
  setdefaultbilling = "setDefaultBillingAddress",
  setdefaultshipping = "setDefaultShippingAddress",
  removeline = "removeLineItem",
  addcode = "addDiscountCode",
  removecode = "removeDiscountCode",
}
export enum Countries {
  BY = "Belarus",
  DE = "Germany",
  PL = "Poland",
  GE = "Georgia",
}
export interface UpdateEmail {
  action: Actions.email;
  email: string;
}
export interface ChangeAddress {
  action: Actions.address;
  addressId: string;
  address: Address;
}
export interface RemoveAddress {
  action: Actions.removeaddress;
  addressId: string;
}
export interface AddAddress {
  action: Actions.addaddress;
  address: Address;
}
export interface AddShippingAddress {
  action: Actions.addshippingaddress;
  addressKey: string;
}
export interface AddBillingAddress {
  action: Actions.addbillingaddress;
  addressKey: string;
}
export interface SetDefaultBilling {
  action: Actions.setdefaultbilling;
  addressKey: string;
}
export interface SetDefaultShipping {
  action: Actions.setdefaultshipping;
  addressKey: string;
}
export interface RemoveLineFromCart {
  action: Actions.removeline;
  lineItemKey: string;
}
export interface AddCode {
  action: Actions.addcode;
  code: string;
}
export interface RemoveCode {
  action: Actions.removecode;
  discountCode: {
    typeId: "discount-code";
    id: string;
  };
}
export type Tuple = [AddAddress, AddShippingAddress | AddBillingAddress];
export type ShippingAddress = string;
export type BillingAddress = string;
