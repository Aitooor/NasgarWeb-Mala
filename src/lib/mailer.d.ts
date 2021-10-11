export declare type EmailPriority = "low" | "normal" | "high";
export declare enum MessageIDType {
    None = 0,
    Verification = 1,
    News = 2,
    Offers = 3
}
export interface MessageIDObject {
    type: MessageIDType;
}
export interface EmailOptions {
    /**
     * The target email
     */
    to: string | string[];
    /**
     * Title of email.
     * If there's 2 or more equal then
     * this email will created as a respond
     * of other emails with same name
     */
    subject: string;
    /**
     * Plain text of email
     */
    text?: string;
    /**
     * Html of email
     */
    html?: string;
    /**
     * Priority of email
     */
    priority?: EmailPriority;
    /**
     * Email message ID
     */
    messageID?: MessageIDObject | string;
    /**
     * See the return info on console
     */
    seeInfo?: boolean;
    /**
     * Another custom options.
     * See Nodemailer package
     */
    raw?: {
        [key: string]: any;
    };
}
/**
 * Generate a message ID to email from some parameters
 */
export declare function generateMessageID(options: MessageIDObject): string;
export declare function sendEmail(emailOptions: EmailOptions): Promise<string>;
export default sendEmail;
