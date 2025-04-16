import { Types } from "mongoose";
export type TOrderStatus = 'pending' | 'completed';

export type TOrder = {
  buyerId: Types.ObjectId;
  sellerId: Types.ObjectId;
  product: Types.ObjectId;
  status : TOrderStatus;
  transaction: {
    id: string;
    transactionStatus: string;
    bank_status: string;
    sp_code: string;
    sp_message: string;
    method: string;
    date_time: string;
    payment_status: string;
  };
};