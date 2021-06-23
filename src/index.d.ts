import * as express from "express";

declare global {
	namespace Express {
		interface Request {
			userData: UserData;
		}
	}
}

type AccountLevelString = "nologged" | "common" | "tester" | "staff" | "admin";
type AccountLevelInt = -1 | 0 | 1 | 2 | 3;


class UserData {
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
	}
}