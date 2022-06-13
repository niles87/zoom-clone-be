import { NextFunction, Request, Response } from "express";
import Room from "../model/Room";
import Controller, { Methods } from "../typing/controller";

export default class RoomController extends Controller {
  path = "/api/rooms";
  routes = [
    {
      path: this.path + "/",
      method: Methods.GET,
      handler: this.handleViewRooms,
      localMiddleware: [],
    },
    {
      path: this.path + "/createroom",
      method: Methods.POST,
      handler: this.handleCreateRoom,
      localMiddleware: [],
    },
    {
      path: this.path + "/addmember/:id",
      method: Methods.PUT,
      handler: this.handleAddMember,
      localMiddleware: [],
    },
  ];
  constructor() {
    super();
  }
  async handleViewRooms(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const rooms = await Room.find({}).select("-__v");
      res.json(rooms);
    } catch (err: any) {
      console.log(err);
      res.status(400).send({ error: err });
    }
  }

  async handleCreateRoom(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { owner } = req.body;
    try {
      const room = await Room.create({ roomOwner: owner, members: [] });
      res.json(room);
    } catch (err: any) {
      console.log(err);
      res.status(400).send({ error: err });
    }
  }

  async handleAddMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    const { member } = req.body;
    try {
      const room = await Room.findByIdAndUpdate(
        id,
        { $push: { members: member._id } },
        { new: true }
      ).select("-__v");
      res.json(room);
    } catch (err: any) {
      console.log(err);
      res.status(400).send({ error: err });
    }
  }
}
