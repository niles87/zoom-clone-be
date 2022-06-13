import { NextFunction, Request, Response } from "express";
import User from "../model/User";
import Controller, { Methods } from "../typing/controller";

export default class UserController extends Controller {
  public path = "/api/users";
  protected routes = [
    {
      path: this.path + "/login",
      method: Methods.POST,
      handler: this.handleLogin,
      localMiddleware: [],
    },
    {
      path: this.path + "/signup",
      method: Methods.POST,
      handler: this.handleSignup,
      localMiddleware: [],
    },
    {
      path: this.path + "/logout/:id",
      method: Methods.PUT,
      handler: this.handleLogout,
      localMiddleware: [],
    },
    {
      path: this.path + "/friends/:id",
      method: Methods.GET,
      handler: this.handleGetFriends,
      localMiddleware: [],
    },
    {
      path: this.path + "/:id",
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

// export const users = {
//   signup: function (req: Request, res: Response) {
//     let newUser = new User({
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       username: req.body.username,
//       email: req.body.email,
//       password: req.body.password,
//     });

//     User.create(newUser)
//       .then((user: IUserModel) => {
//         res.json({ username: user.username });
//       })
//       .catch((err: any) => {
//         console.error(err.message);
//         res.sendStatus(404);
//       });
//   },
//   login: async function (req: Request, res: Response) {
//     const { email, password } = req.body;
//     try {
//       const user: IUserModel | null = await User.findOne({ email });
//       if (user) {
//         if (await user.comparePassword(password)) {
//           const updateOnline = await User.updateOne(
//             { _id: user._id },
//             { $set: { isOnline: true } },
//             { new: true }
//           ).select("-__v -password");
//           if (updateOnline.nModified > 0) {
//             res.json({ username: user.username, id: user._id, isOnline: true });
//           } else {
//             res.sendStatus(500);
//           }
//         }
//       } else {
//         res.sendStatus(404);
//       }
//     } catch (err) {
//       console.error(err.message);
//       res.sendStatus(500);
//     }
//   },
//   logout: async function (req: Request, res: Response) {
//     const { id } = req.params;
//     try {
//       const user: IUserModel | null = await User.findById({ _id: id });
//       if (user) {
//         const updateOnline = await User.updateOne(
//           { _id: user._id },
//           { $set: { isOnline: false } }
//         );
//         if (updateOnline.nModified > 0) {
//           res.sendStatus(200);
//         } else {
//           res.sendStatus(404);
//         }
//       } else {
//         res.sendStatus(404);
//       }
//     } catch (err) {
//       console.error(err.message);
//       res.sendStatus(500);
//     }
//   },
//   getFriends: async function (req: Request, res: Response) {
//     const { id } = req.params;
//     console.log(id);
//     try {
//       const friendsList: IUserModel | null = await User.findById({ _id: id });
//       if (friendsList) {
//         res.json(friendsList.friends);
//       } else {
//         res.sendStatus(500);
//       }
//     } catch (err) {
//       console.error(err.message);
//       res.sendStatus(500);
//     }
//   },
//   getUserInfo: async function (req: Request, res: Response) {
//     const { id } = req.params;
//     try {
//       const user: IUserModel | null = await User.findById(id).select(
//         "-__v -friends -password -firstName -lastName"
//       );
//       res.json(user);
//     } catch (err) {
//       console.log(err);
//     }
//   },
// };
