import { AddressData } from "../../../types/types";

export function createaAddressTemplate(
  legend: string,
  buttonAttr: string,
  obj?: AddressData,
): string {
  return `
    <form class="form aside__form">
      <fieldset class="form__section">
        <legend class="form__subtitle">${legend}</legend>
        <p class="form__wrapper aside__form-wrapper">
          <label class="form__label" for="country">Country <span class="form__asterisk">*</span></label>
          <span class="form__input-wrapper">
          <select value="${
            obj?.countryCode || "BY"
          }" class="form__field valid" id="country" name="countryCode" required>
            <option value="" disabled>Choose your country:</option>
            <option value="BY">Belarus (BY)</option>
            <option value="DE">Germany (DE)</option>
            <option value="PL">Poland (PL)</option>
            <option value="GE">Georgia (GE)</option>
          </select>
          <span class="form__message" aria-live="polite"></span>
          </span>
        </p>
        <p class="form__wrapper aside__form-wrapper">
          <label class="form__label" for="street">Street <span class="form__asterisk">*</span></label>
          <span class="form__input-wrapper">
            <input class="form__field" id="street" type="text" name="streetName" value="${
              obj?.streetName || ""
            }" placeholder="Street" data-type="street" required>
            <span class="form__message" aria-live="polite"></span>
          </span>
        </p>
        <p class="form__wrapper aside__form-wrapper">
          <label class="form__label" for="building">Building</label>
          <span class="form__input-wrapper">
            <input class="form__field" id="building" type="text" name="building" value="${
              obj?.building || ""
            }" placeholder="Building">
            <span class="form__message" aria-live="polite"></span>
          </span>
        </p>
        <p class="form__wrapper aside__form-wrapper">
            <label class="form__label" for="apartment">Apartment / Suite</span></label>
            <span class="form__input-wrapper">
              <input class="form__field" id="apartment" type="text" name="apartment" value="${
                obj?.apartment || ""
              }" placeholder="Apartment / Suite">
              <span class="form__message" aria-live="polite"></span>
            </span>
        </p>
        <p class="form__wrapper aside__form-wrapper">
          <label class="form__label" for="city">City <span class="form__asterisk">*</span></label>
          <span class="form__input-wrapper">
            <input class="form__field" id="city" type="text" name="city" value="${
              obj?.city || ""
            }" placeholder="City" data-type="city" required>
            <span class="form__message" aria-live="polite"></span>
          </span>
        </p>
        <p class="form__wrapper aside__form-wrapper">
            <label class="form__label" for="postal_code">Postal Code <span class="form__asterisk">*</span></label>
            <span class="form__input-wrapper">
              <input class="form__field" id="postal_code" type="text" name="postalCode" value="${
                obj?.postalCode || ""
              }" placeholder="Postal Code" data-type="code" required>
              <span class="form__message" aria-live="polite"></span>
            </span>
        </p>
      </fieldset>
      <button class="btn aside__btn" type="submit" data-action="${buttonAttr}">Save</button>
    </form>
    `;
}
