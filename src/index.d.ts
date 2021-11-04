import * as express from "express";
import winston from "winston";

declare global {
	namespace Express {
		interface Request {
			userData: UserData;
		}
	}

	namespace NodeJS {
		interface Process {
			PRODUCTION: boolean,
			WEB_HREF: string,
			logger?: {
				setted: boolean;
				separator: string;
				loggers: {
					console: winston.Logger;
					log: winston.Logger;
					debug: winston.Logger;
					error: winston.Logger;
				};
			};
		}
	}
}

type AccountLevelString = "nologged" | "common" | "tester" | "staff" | "admin";
type AccountLevelInt = -1 | 0 | 1 | 2 | 3;


declare class UserData {
	private constructor(req: express.Request, res: express.Response);

	account: {
		level: {
			string: AccountLevelString,
			int: AccountLevelInt
		}
	}
}

declare module 'express-session' {
	interface SessionData {
		isStaff: boolean;
		alert: string;
		showAlert: boolean;

		staffLogin_landing: string;

		accountLevelString: AccountLevelString;
		accountLevelInt: AccountLevelInt;

		[key: string]: any;
	}
}
