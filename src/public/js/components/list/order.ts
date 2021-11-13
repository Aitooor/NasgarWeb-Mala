import ElementList, { ElementList_Options } from "./list";

const Events: typeof ElementList.Events = ElementList.Events;

export interface OrdenedElementList_Options extends ElementList_Options {
  autoRefresh: boolean;
}

const DefaultOptions: OrdenedElementList_Options = {
  idTarget: "uuid",
  autoRefresh: true,
};

export class OrdenedElementList<
  T extends any = any,
  K extends HTMLElement = HTMLDivElement
> extends ElementList<T, K> {
  static NO_URL: string = "NOURL";

  protected _options: OrdenedElementList_Options;

  constructor(
    parent: HTMLDivElement,
    url: string = OrdenedElementList.NO_URL,
    options?: OrdenedElementList_Options
  ) {
    super(parent, url, options);
    this._options = Object.assign({}, DefaultOptions, options);

    if (url === OrdenedElementList.NO_URL) {
      this.refresh = this.__refresh;
    }
  }

  private async __refresh(): Promise<T[]> {
    if (this.isLoading) return this.data;
    this.isLoading = true;

    this.parent.classList.remove("no-data");
    this.parent.classList.add("loading");
    this.parent.innerHTML = "Loading...";

    const elements: K[] = this._render();

    if (elements.length === 0) {
      this.parent.innerHTML = "No data";
      this.parent.classList.add("no-data");
    } else {
      this.parent.innerHTML = "";
      this.parent.append(...elements);
    }

    this.parent.classList.remove("loading");

    this.isLoading = false;

    return this.data;
  }

  private _getIndex(elm: T | number): number {
    if (typeof elm === "number") return elm;
    return this.data.indexOf(elm);
  }

  /**
   * Search index of Target and send it one index to up.
   * @param elm Target
   */
  goUp(elm: T): T[];

  /**
   * Send Target one index to up.
   * @param elm Target
   */
  goUp(elm: number): T[];
  goUp(elm: T | number): T[] {
    const elmIndex = this._getIndex(elm);
    if(elmIndex >= 0) return this.data;
    const [tmp] = this.data.splice(elmIndex, 1);
    this.data.splice(elmIndex - 1, 0, tmp);

    if (this._options.autoRefresh) this.refresh();
    return this.data;
  }

  goDown(elm: T | number): T[] {
    const elmIndex = this._getIndex(elm);
    if(elmIndex >= 0) return this.data;
    const [tmp] = this.data.splice(elmIndex, 1);
    this.data.splice(elmIndex + 1, 0, tmp);

    if (this._options.autoRefresh) this.refresh();
    return this.data;
  }

  delete(elm: T | number): T[] {
    const elmIndex = this._getIndex(elm);
    if(elmIndex >= 0) return this.data;
    const [tmp] = this.data.splice(elmIndex, 1);

    if (this._options.autoRefresh) this.refresh();
    return this.data;
  }
}
