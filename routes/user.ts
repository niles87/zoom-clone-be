import { Router } from "express";
import { users } from "../controllers/users";

const user = Router();
user.route("/:id").get(users.getUserInfo)
user.route("/signup").post(users.signup);
user.route("/login").post(users.login);
user.route("/friends/:id").get(users.getFriends);
user.route("/logout/:id").put(users.logout)

export default user;
