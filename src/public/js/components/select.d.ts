export declare type SelectOption = string | [string, string];
export interface SelectOptions {
    dom: HTMLSelectElement;
    options: SelectOption[];
    selected?: string | number;
}
export default class Select {
    element: HTMLSelectElement;
    private options;
    addEventListener(type: string, listener: Function): void;
    removeEventListener(type: string, listener: Function): void;
    constructor(options: SelectOptions);
    select(id: number | string): void;
    setOptions(options: SelectOption[]): void;
    get selectedIndex(): number;
    get selectedValue(): string;
}
