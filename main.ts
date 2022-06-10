import { json, RequestHandler, urlencoded } from "express";
import cors from "cors";
import mongoose from "mongoose";
import { Server } from "./typing/server";
import { VideoServer } from "./typing/video-server";
import { UserController, RoomController } from "./controllers";
import { config } from "./config/db";
import Controller from "./typing/controller";

const PORT: number = Number(process.env.PORT) || 4000;

const globalMiddleWare: Array<RequestHandler> = [
  urlencoded({ extended: false }) as RequestHandler,
  json() as RequestHandler,
  cors(),
];

const controllers: Array<Controller> = [
  new UserController(),
  new RoomController(),
];

const server: Server = new Server(PORT, mongoose);

Promise.resolve().then(() =>
  server.initMongoose(config.database, {}).then(() => {
    server.initializeMiddleware(globalMiddleWare);
    server.initializeControllers(controllers);
    const httpServer = server.init();
    const videoServer = new VideoServer(httpServer);
    videoServer.init();
  })
);
