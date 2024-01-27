import Validate from "../../../utils/validation";

export default function setShippingDefault(): void {
  const useLikeBillingAddressCheckbox = document.getElementById(
    "billing_address_checkbox",
  ) as HTMLInputElement;
  const defaultBillingCheckbox = document.getElementById(
    "default_billing_checkbox",
  ) as HTMLInputElement;
  const billingStreet = document.getElementById(
    "billing_street",
  ) as HTMLInputElement;
  const billingBuilding = document.getElementById(
    "billing_building",
  ) as HTMLInputElement;
  const billingApartment = document.getElementById(
    "billing_apartment",
  ) as HTMLInputElement;
  const billingCity = document.getElementById(
    "billing_city",
  ) as HTMLInputElement;
  const billingPostalCode = document.getElementById(
    "billing_postal_code",
  ) as HTMLInputElement;
  const billingCountry = document.getElementById(
    "billing_country",
  ) as HTMLSelectElement;
  const shippingStreet = document.getElementById(
    "shipping_street",
  ) as HTMLInputElement;
  const shippingBuilding = document.getElementById(
    "shipping_building",
  ) as HTMLInputElement;
  const shippingApartment = document.getElementById(
    "shipping_apartment",
  ) as HTMLInputElement;
  const shippingCity = document.getElementById(
    "shipping_city",
  ) as HTMLInputElement;
  const shippingPostalCode = document.getElementById(
    "shipping_postal_code",
  ) as HTMLInputElement;
  const shippingCountry = document.getElementById(
    "shipping_country",
  ) as HTMLSelectElement;

  function validateBillingFields(field: HTMLInputElement | HTMLSelectElement) {
    const validate = new Validate(field);
    if (field.tagName === "INPUT") {
      validate.validateText();
    }
  }

  function updateBillingAddress() {
    const isChecked = useLikeBillingAddressCheckbox.checked;

    if (isChecked) {
      billingStreet.value = shippingStreet.value;
      billingBuilding.value = shippingBuilding.value;
      billingApartment.value = shippingApartment.value;
      billingCity.value = shippingCity.value;
      billingPostalCode.value = shippingPostalCode.value;
      billingCountry.value = shippingCountry.value;
      defaultBillingCheckbox.checked = true;

      billingStreet.readOnly = true;
      billingBuilding.readOnly = true;
      billingApartment.readOnly = true;
      billingCity.readOnly = true;
      billingPostalCode.readOnly = true;
      billingCountry.classList.add("read-only");
      defaultBillingCheckbox.closest("label")?.classList.add("read-only");
      validateBillingFields(billingStreet);
      validateBillingFields(billingCity);
      validateBillingFields(billingPostalCode);
    } else {
      shippingStreet.removeEventListener("input", updateBillingAddress);
      shippingCity.removeEventListener("input", updateBillingAddress);
      shippingPostalCode.removeEventListener("input", updateBillingAddress);
      billingStreet.readOnly = false;
      billingBuilding.readOnly = false;
      billingApartment.readOnly = false;
      billingCity.readOnly = false;
      billingPostalCode.readOnly = false;
      billingCountry.classList.remove("read-only");
      defaultBillingCheckbox.closest("label")?.classList.remove("read-only");

      billingStreet.value = "";
      validateBillingFields(billingStreet);
      billingBuilding.value = "";
      billingApartment.value = "";
      billingCity.value = "";
      validateBillingFields(billingCity);
      billingPostalCode.value = "";
      validateBillingFields(billingPostalCode);
      billingCountry.value = "BY";
    }
  }

  shippingStreet.addEventListener("input", updateBillingAddress);
  shippingCity.addEventListener("input", updateBillingAddress);
  shippingPostalCode.addEventListener("input", updateBillingAddress);
  shippingCountry.addEventListener("change", updateBillingAddress);
  shippingBuilding.addEventListener("input", updateBillingAddress);
  shippingApartment.addEventListener("input", updateBillingAddress);
  useLikeBillingAddressCheckbox.addEventListener(
    "change",
    updateBillingAddress,
  );
}
