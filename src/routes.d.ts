import { Express } from "express";

declare function routes(app: Express, ...args: any[]): void;

export = routes;