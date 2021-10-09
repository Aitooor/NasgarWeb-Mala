import {v4 as uuidV4} from "uuid"
import CONFIG from "../../config"
import nodemailer from "nodemailer"

const emailTransport = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: CONFIG.EMAIL_AUTH
});

export type EmailPriority = "low" | "normal" | "high";

export enum MessageIDType {
	None,
	Verification,
	News,
	Offers
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
	raw?: { [key: string]: any };
}

/**
 * Generate a message ID to email from some parameters
 */
export function generateMessageID(options: MessageIDObject): string {
	const uuid = uuidV4().toLowerCase();
	const type = options?.type || 0;
	
	return `<type-${type}+${uuid}@nasgarnetwork>`;
}

export function sendEmail(emailOptions: EmailOptions): Promise<string> {return new Promise((res, rej) => {
	const messageId = (
		typeof emailOptions.messageID !== undefined ?  
			typeof emailOptions.messageID === "string" ? 
				emailOptions.messageID :
				generateMessageID(emailOptions.messageID) : 
			generateMessageID({ 
				type: MessageIDType.None
			})
	);

	const rawEmailOptions = {
		to: emailOptions.to,
		subject: emailOptions.subject,
		text: emailOptions.text || "",
		html: emailOptions.html || undefined,
		priority: emailOptions.priority || "normal",
		messageId: messageId
	};

	emailTransport.sendMail(
		Object.assign(
			rawEmailOptions, 
			emailOptions.raw || {}), 
		(err, info) => {
			if(err) rej(err);

			if(emailOptions.seeInfo) {
				console.log(info);
			}

			res(messageId);
		});
})};

export default sendEmail;
