import * as express from "express";

declare global {
	namespace Express {
		interface Request {
			userData: UserData;
		}
	}
}


class UserData {
	private constructor(req: express.Request, res: express.Response);
	accountLevel: "noLogged" | "Common" | "Staff" | "Admin";
}

declare module 'express-session' {
	interface SessionData {
		isStaff: boolean;
		alert: string;
		showAlert: boolean;

		accountLevel: "noLogged" | "Common" | "Staff" | "Admin";
	}
}