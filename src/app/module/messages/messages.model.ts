import mongoose, { Schema, model } from "mongoose";
import { TMessage } from "./messages.interface";

const messageSchema = new mongoose.Schema<TMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender ID is required..."],
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Receiver ID is required..."],
    },
    message: {
      type: String,
      required: [true, "Message content cannot be empty..."],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Message = model<TMessage>("Message", messageSchema);
