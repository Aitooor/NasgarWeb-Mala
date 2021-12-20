import paypal from "paypal-rest-sdk";
export declare const instance: typeof paypal;
export declare function configure(sandbox?: boolean): void;
export interface PaymentItem {
    uuid: string;
    name: string;
    quantity: number;
    price: number;
    gift: false | string;
}
export interface PaymentOptions {
    redirect_urls: {
        return_url: string;
        cancel_url: string;
    };
    items: PaymentItem[];
    discount?: {
        modify: number;
    };
}
export declare function createPayment(options: PaymentOptions): Promise<paypal.PaymentResponse>;
export interface ShopPaymentOptions {
    cart: PaymentItem[];
    cart_string: string;
    discount?: {
        modify: number;
    };
}
export declare function createShopPayment(options: ShopPaymentOptions): Promise<paypal.PaymentResponse>;
export declare function verifyPayment(payID: string): Promise<Boolean>;
