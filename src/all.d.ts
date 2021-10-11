import { Pool } from "mysql";
import * as Rcon from "rcon";
import express from "express";
import { Server as SocketServer} from "socket.io";
import { Server as HttpServer } from "http";

namespace Routes {
	interface Route {
        (db: () => Pool, rcons: Rcon, io: lib_SocketIo.SocketIo): void;
        r: express.Router;
        thisRoute: string;
    }
}

namespace MyExpress {
    declare type Request = express.Request<RouteParameters<string>, any, any, qs.ParsedQs, Record<string, any>>;
    declare type _Response = express.Response<any, Record<string, any>, number>;

    declare var Response: express.Response<any, Record<string, any>, number>; 
}

namespace lib_SocketIo {
    interface SocketIo {
        io: SocketServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
    }
    declare function exports(app: HttpServer): SocketIo;
}