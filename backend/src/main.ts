import Auth from "./models/Auth";
import User from "./models/User";
import {MongoClient} from "mongodb";
import {HTTPRequestHandler, CORSMiddleware } from "http-request-handler";
const { Config } = require("../config");
import http from "http";
import {initNoteRoutes} from "./routes/noteRoutes";
import {initUserRoutes} from "./routes/userRoutes";
import {initLabelRoutes} from "./routes/labelRoutes";

const handler = new HTTPRequestHandler({
    endpoint: "/api"
});

handler.registerGlobalMiddlewareFunction(CORSMiddleware);

initUserRoutes(handler);
initLabelRoutes(handler);
initNoteRoutes(handler);

Auth.init();

MongoClient.connect(Config.mongoURL, async (err, db) => {
    if (err) throw err;
    if (db !== undefined) {
        let database = db.db(Config.mongoDatabaseName);
        User.init(database.collection("users"));

        http.createServer(handler.getListener()).listen(3001);
        console.log("Server started.");
    } else {
        console.error("db is undefined.");
    }
});

process.on("SIGINT", () => {
    Auth.save();
    process.exit(0);
});