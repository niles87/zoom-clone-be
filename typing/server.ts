import express, { RequestHandler } from "express";
import Controller from "./controller";
import http from "http";
import { Mongoose } from "mongoose";

export class Server {
  app: express.Application;
  port: number;
  mongoose: Mongoose;
  constructor(port: number, mongoose: Mongoose) {
    this.app = express();
    this.port = port;
    this.mongoose = mongoose;
  }

  initializeMiddleware(middleware: Array<RequestHandler>) {
    middleware.forEach((mw: RequestHandler) => {
      this.app.use(mw);
    });
  }

  initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller: Controller) => {
      this.app.use(controller.path, controller.setRoutes());
    });
  }

  init(): http.Server {
    return this.app.listen(this.port, () => {
      console.log(`👋 running on ${this.port}`);
    });
  }

  async initMongoose(uri: string, options: any): Promise<void> {
    try {
      this.mongoose.connect(uri, options);
      this.mongoose.connection.on("connected", () => {
        console.log("mongodb connected");
      });
    } catch (err: any) {
      console.log(err);
    }
  }
}
