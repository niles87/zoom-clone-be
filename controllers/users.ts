import { Request, Response } from "express";
import User, { IUserModel } from "../model/User";

export const users = {
  signup: function (req: Request, res: Response) {
    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    User.create(newUser)
      .then((user: IUserModel) => {
        res.json({ username: user.username });
      })
      .catch((err: any) => {
        console.error(err.message);
        res.sendStatus(404);
      });
  },
  login: async function (req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const user: IUserModel | null = await User.findOne({ email });
      if (user) {
        if (user.comparePassword(password)) {
          const updateOnline = await User.updateOne(
            { _id: user._id },
            { $set: { isOnline: true } }
          );
          if (updateOnline.nModified > 0) {
            res.json({ username: user.username, id: user._id, isOnline: true });
          } else {
            res.sendStatus(500);
          }
        }
      } else {
        res.sendStatus(404);
      }
    } catch (err) {
      console.error(err.message);
      res.sendStatus(500);
    }
  },
  logout: async function (req: Request, res: Response) {
    const { id } = req.params
    try {
      const user: IUserModel | null = await User.findById({ _id: id })
      if (user) {
        const updateOnline = await User.updateOne(
          { _id: user._id },
          { $set: { isOnline: false } }
        )
        if (updateOnline.nModified > 0) {
          res.sendStatus(200)
        } else {
          res.sendStatus(404)
        }
      } else {
        res.sendStatus(404)
      }
    } catch (err) {
      console.error(err.message)
      res.sendStatus(500)
    }
  },
  getFriends: async function (req: Request, res: Response) {
    const { id } = req.params;
    console.log(id);
    try {
      const friendsList: IUserModel | null = await User.findById({ _id: id });
      if (friendsList) {
        res.json(friendsList.friends);
      } else {
        res.sendStatus(500);
      }
    } catch (err) {
      console.error(err.message);
      res.sendStatus(500);
    }
  },
  getUserInfo: async function (req: Request, res: Response) {
    const { id } = req.params
    try {
      const user: IUserModel | null = await User.findById(id).select("-__v -friends -password -firstName -lastName");
      res.json(user)
    } catch (err) {
      console.log(err)
    }
  }
};
