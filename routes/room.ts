import { Router as router } from "express";
import { rooms } from "../controllers/rooms";

const room = router();
room.route("/").get(rooms.seeRooms);
room.route("/createRoom").post(rooms.create);
room.route("/addMember/:id").post(rooms.addMemberToRoom)

export default room;
