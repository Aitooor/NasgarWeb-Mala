import { Pool } from "mysql";
import * as Rcon from "rcon";
import express from "express";
import { Server as SocketServer} from "socket.io";
import { Server as HttpServer } from "http";

declare namespace Routes {
	interface Route {
        (db: () => Pool, rcons: Rcon, io: lib_SocketIo.SocketIo): void;
        r: express.Router;
        thisRoute: string;
    }
}

declare namespace MyExpress {
    type Request = express.Request<{ [k: string]: string }, any, any, qs.ParsedQs, Record<string, any>>;
    type _Response = express.Response<any, Record<string, any>>;

    var Response: express.Response<any, Record<string, any>>; 
}

declare namespace lib_SocketIo {
    interface SocketIo {
        io: SocketServer
    }
    
    function exports(app: HttpServer): SocketIo;
}
