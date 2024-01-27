interface FilterAttributeParam {
  readonly str: string;
  readonly values: { checkbox: HTMLElement | null; param: string }[];
  getParam: () => string | undefined;
}

class FilterAndSort {
  private color: FilterAttributeParam;

  private brend: FilterAttributeParam;

  private price: FilterAttributeParam;

  private size: FilterAttributeParam;

  public category: { readonly str: string; getParam: () => string | undefined };

  public sort: {
    readonly box: HTMLElement | null;
    readonly variants: [string, string][];
    getParam(): string;
  };

  public checkboxes: NodeListOf<Element>;

  constructor() {
    this.color = {
      str: "variants.attributes.color.key:",
      values: [
        {
          checkbox: document.getElementById("yellow__checkbox"),
          param: '"color-yellow"',
        },
        {
          checkbox: document.getElementById("red__checkbox"),
          param: '"color-red"',
        },
        {
          checkbox: document.getElementById("blue__checkbox"),
          param: '"color-blue"',
        },
        {
          checkbox: document.getElementById("black__checkbox"),
          param: '"color-black"',
        },
      ],
      getParam() {
        return FilterAndSort.createAttributeParams(this.str, this.values);
      },
    };

    this.brend = {
      str: "variants.attributes.brend.key:",
      values: [
        {
          checkbox: document.getElementById("prada__checkbox"),
          param: '"prada"',
        },
        {
          checkbox: document.getElementById("dior__checkbox"),
          param: '"dior"',
        },
        {
          checkbox: document.getElementById("chanel__checkbox"),
          param: '"chanel"',
        },
        {
          checkbox: document.getElementById("gucci__checkbox"),
          param: '"gucci"',
        },
        {
          checkbox: document.getElementById("versace__checkbox"),
          param: '"versace"',
        },
        {
          checkbox: document.getElementById("fendi__checkbox"),
          param: '"fendi"',
        },
      ],
      getParam() {
        return FilterAndSort.createAttributeParams(this.str, this.values);
      },
    };

    this.price = {
      str: "variants.attributes.price.key:",
      values: [
        {
          checkbox: document.getElementById("cheap__checkbox"),
          param: '"cheap"',
        },
        {
          checkbox: document.getElementById("mediumPrice__checkbox"),
          param: '"medium"',
        },
        {
          checkbox: document.getElementById("expencive__checkbox"),
          param: '"expencive"',
        },
      ],
      getParam() {
        return FilterAndSort.createAttributeParams(this.str, this.values);
      },
    };

    this.size = {
      str: "variants.attributes.size.key:",
      values: [
        {
          checkbox: document.getElementById("small__checkbox"),
          param: '"CS-01-S"',
        },
        {
          checkbox: document.getElementById("medium__checkbox"),
          param: '"CS-01-M"',
        },
        {
          checkbox: document.getElementById("large__checkbox"),
          param: '"CS-01-L"',
        },
      ],
      getParam() {
        return FilterAndSort.createAttributeParams(this.str, this.values);
      },
    };

    this.category = {
      str: "variants.categories.id:",
      getParam() {
        const box = document.querySelector(".selected");
        if (!box) return undefined;
        const value = box.getAttribute("key") || "";
        return value === "" ? undefined : `${this.str}"${value}"`;
      },
    };

    this.sort = {
      box: document.getElementById("sort-select"),
      variants: [
        ["name-asc", "name.en asc"],
        ["name-desc", "name.en desc"],
        ["price-desc", "price desc"],
      ],
      getParam() {
        if (!this.box || !(this.box instanceof HTMLSelectElement)) return "";
        const result = this.variants.reduce(
          (acc: string, el: [string, string]) => {
            if (
              this.box &&
              this.box instanceof HTMLSelectElement &&
              this.box.value === el[0]
            ) {
              // eslint-disable-next-line prefer-destructuring
              acc = el[1];
            }
            return acc;
          },
          "price asc",
        );
        return result;
      },
    };

    this.checkboxes = document.querySelectorAll(".form__checkbox");
  }

  public getFilterParams() {
    const params = [
      this.color.getParam(),
      this.brend.getParam(),
      this.price.getParam(),
      this.size.getParam(),
      this.category.getParam(),
    ].reduce((acc: string[], el) => {
      if (el !== undefined) acc.push(el);
      return acc;
    }, []);
    return params;
  }

  private static createAttributeParams(
    str: string,
    values: { checkbox: HTMLElement | null; param: string }[],
  ) {
    const params = values.reduce((acc: string[], el) => {
      if (!el.checkbox) throw new Error("checkbox is not found");
      if (el.checkbox instanceof HTMLInputElement && el.checkbox.checked) {
        acc.push(el.param);
      }
      return acc;
    }, []);
    if (params.length > 0) {
      return `${str}${params.join(",")}`;
    }
    return undefined;
  }

  public resetFilter() {
    this.checkboxes.forEach((el) => {
      if (el instanceof HTMLInputElement) {
        el.checked = false;
      }
    });
  }
}

export default FilterAndSort;
