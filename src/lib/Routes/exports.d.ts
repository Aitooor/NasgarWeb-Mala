import express from "express";
import { Pool } from "mysql";
import RCON from "rcon";
import { Routes } from "../../all";

declare namespace exports {
	type _waitAndRedirect = (res: express.Response<any, Record<string, any>>, renderUrl: string, landingUrl: string, options) => void;
	type _callback = (router: express.Router, waitAndRedirect: _waitAndRedirect, db: () => Pool, rcon: RCON[]) => void;
	function exports(route: string, callback: _callback): Routes.Route;
}
export = exports.exports;