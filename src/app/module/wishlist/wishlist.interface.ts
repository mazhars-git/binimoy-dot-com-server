import { Types } from "mongoose"

export type TWishlist = {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  isDeleted?: boolean;
};