import { z } from "zod";
import mongoose from "mongoose";

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

export const createMessageValidationSchema = z.object({
  body: z.object({
    senderId: z.string().refine(isValidObjectId, {
      message: "Invalid sender ID format. Please provide a valid MongoDB ObjectId.",
    }),
    receiverId: z.string().refine(isValidObjectId, {
      message: "Invalid receiver ID format. Please provide a valid MongoDB ObjectId.",
    }),
    message: z.string().min(1, {
      message: "Message text cannot be empty. Please enter something to send.",
    }),
  }),
});

export const messageValidation = {
  createMessageValidationSchema,
};
