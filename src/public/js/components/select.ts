
export interface SelectOptions {
    dom: HTMLSelectElement;
    options: string[];
    selected?: string | number;
}

export default class Select {

  element: HTMLSelectElement;
  private options: string[];

  addEventListener(type: string, listener: Function) {}
  removeEventListener(type: string, listener: Function) {}

  /**
   * @example
   * const select = new Select({ ... });
   */
  constructor(options: SelectOptions) {
    this.element = options.dom;
    
    this.setOptions(options.options);

    this.select(options.selected ?? 0);

    this.addEventListener = options.dom.addEventListener.bind(options.dom);
    this.removeEventListener = options.dom.removeEventListener.bind(options.dom);
  }

  select(id: number | string) {
    if(typeof id === "number") {
      this.element.selectedIndex = id;
    } else {
      this.element.selectedIndex = Math.max(0, this.options.indexOf(id))
    }
  }

  setOptions(options: string[]) {
    this.element.innerHTML = "";
    this.options = options;

    for(const option of options) {
      const dom = document.createElement("option");
      dom.innerHTML = option;
      dom.value = option;
      
      this.element.append(dom);
    }
  }

  get selectedIndex(): number {
    return this.element.selectedIndex;
  }

  get selectedValue(): string {
    return this.options[this.element.selectedIndex];
  }
}
