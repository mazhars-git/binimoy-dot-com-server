import mongoose, { Schema } from "mongoose";
import { TOrder } from "./order.interface";
import { TOrderStatus } from "./order.constant";

const orderSchema = new mongoose.Schema<TOrder>(
  {
    buyerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    status: {
        type: String,
        enum: {
          values: TOrderStatus,
          message: `VALUE is not supported`,
        },
        default: 'pending',
      },
    transaction: {
        id: String,
        transactionStatus: String,
        bank_status: String,
        sp_code: String,
        sp_message: String,
        method: String,
        date_time: String,
        payment_status: String,
    },
  },
  {
    timestamps: true,
  },
);
  
  export const Order = mongoose.model<TOrder>('Order', orderSchema);