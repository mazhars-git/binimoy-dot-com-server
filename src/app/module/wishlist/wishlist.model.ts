
import { Schema, model } from "mongoose";
import { TWishlist } from "./wishlist.interface";

const wishlistSchema = new Schema<TWishlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);


export const Wishlist = model<TWishlist>("Wishlist", wishlistSchema);
