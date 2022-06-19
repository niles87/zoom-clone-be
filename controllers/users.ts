import { NextFunction, Request, Response } from "express";
import User from "../model/User";
import Controller, { Methods } from "../typing/controller";

export default class UserController extends Controller {
  public path = "/api/users";
  protected routes = [
    {
      path: "/login",
      method: Methods.POST,
      handler: this.handleLogin,
      localMiddleware: [],
    },
    {
      path: "/signup",
      method: Methods.POST,
      handler: this.handleSignup,
      localMiddleware: [],
    },
    {
      path: "/logout/:id",
      method: Methods.PUT,
      handler: this.handleLogout,
      localMiddleware: [],
    },
    {
      path: "/friends/:id",
      method: Methods.GET,
      handler: this.handleGetFriends,
      localMiddleware: [],
    },
    {
      path: "/:id",
      method: Methods.GET,
      handler: this.handleUserInfo,
      localMiddleware: [],
    },
  ];
  constructor() {
    super();
  }
  async handleSignup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await User.create(req.body);
      res.json({ username: user.username });
    } catch (err: any) {
      console.log(err);
      res.status(400).send({ error: err });
    }
  }

  async handleLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const validUser = await user.comparePassword(req.body.password);
        if (validUser) {
          const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $set: { isOnline: true } },
            { new: true }
          ).select("-__v -password");
          if (updatedUser) {
            res.json(updatedUser);
          } else {
            res.status(500).send({ error: "failed to update" });
          }
        }
      } else {
        res.status(404).send({ error: "Resource not found" });
      }
    } catch (err: any) {
      res.status(400).send({ error: err });
    }
  }

  async handleLogout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    try {
      const user = await User.findByIdAndUpdate(
        id,
        { $set: { isOnline: false } },
        { new: true }
      ).select("-__v -password");
      if (user) {
        res.json(user);
      }
    } catch (err: any) {
      console.log(err);
      res.status(404).send({ error: err });
    }
  }

  async handleGetFriends(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    try {
      const user = await User.findById(id).populate({
        path: "friends",
        select: "-__v -password -firstName -lastName",
      });
      if (user) {
        res.json(user.friends);
      } else {
        res.status(400).send({ error: "Friends Not Found" });
      }
    } catch (err: any) {
      console.log(err);
      res.status(500).send({ error: err });
    }
  }

  async handleUserInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { id } = req.params;
    try {
      const user = await User.findById(id).select(
        "-__v -friends -password -firstName -lastName"
      );
      res.json(user);
    } catch (err: any) {
      console.log(err);
      res.status(400).send({ error: err });
    }
  }
}
