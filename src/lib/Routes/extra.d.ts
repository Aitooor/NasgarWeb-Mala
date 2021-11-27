import { Router } from "express";
import { Routes } from "../../all";

declare function extra(route: Routes.Route, ...args: any[]): Router;

export = extra;
