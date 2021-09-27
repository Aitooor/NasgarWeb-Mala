export interface SelectOptions {
    dom: HTMLSelectElement;
    options: string[];
    selected?: string | number;
}
export default class Select {
    element: HTMLSelectElement;
    private options;
    addEventListener(type: string, listener: Function): void;
    removeEventListener(type: string, listener: Function): void;
    /**
     * @example
     * const select = new Select({ ... });
     */
    constructor(options: SelectOptions);
    select(id: number | string): void;
    setOptions(options: string[]): void;
    get selectedIndex(): number;
    get selectedValue(): string;
}
