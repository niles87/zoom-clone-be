import { Request, Response } from "express";
import Room, { IRoomModel } from "../model/Room";

export const rooms = {
  seeRooms: function (req: Request, res: Response) {
    Room.find({}).select("-__v").then((rooms) => res.json(rooms));
  },
  create: function (req: Request, res: Response) {
    const { owner } = req.body;
    Room.create({ roomOwner: owner, members: [] })
      .then((room: IRoomModel) => {
        res.json(room);
      })
      .catch((err: any) => {
        console.error(err.message);
        res.sendStatus(418);
      });
  },
  addMemberToRoom: async function (req: Request, res: Response) {
    const { id } = req.params
    const { member } = req.body
    try {
      const room = await Room.findByIdAndUpdate({ _id: id }, {
        $push: { members: member._id }
      }, { new: true }).select("-__v")
      res.json(room)
    } catch (error) {
      res.sendStatus(404)
    }
  }
};
