import Param from "../../types/elementCreator/param";
import View from "../utils/view";

const cssClasses = {
  main: "main",
};

const TEXT = "SPA MAIN";

export default class MainView extends View {
  constructor() {
    const params: Param = {
      tag: "main",
      classNames: [`${cssClasses.main}`],
      textContent: TEXT,
    };
    super(params);
  }
}
