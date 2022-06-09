import { Document, model, Schema, Types } from "mongoose";

const RoomSchema = new Schema({
  roomOwner: {
    type: String,
    required: true
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

interface IRoomSchema extends Document {
  roomOwner: string;
  members: Types.Array<string>;
}

export interface IRoomModel extends IRoomSchema { }

export default model<IRoomModel>("Room", RoomSchema);
