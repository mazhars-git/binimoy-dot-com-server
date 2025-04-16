import mongoose from 'mongoose';
import { z } from 'zod';
import { TOrderStatus } from './order.constant';

//Order validation schema
const createOrderValidationSchema = z.object({
  body: z.object({
    buyerID: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid Buyer ID format.',
    }),
    sellerID: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid Seller ID format.',
    }),
    itemID: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid Product ID format.',
    }),
    status: z
      .enum([ ...TOrderStatus ] as [string, ...string[]], {
        message: 'Order status is required.',
        invalid_type_error: 'Invalid order status value.',
      })
      .optional(),
  }),
});

const updateOrderValidationSchema = z.object({
  body: z.object({
    status: z.enum([...TOrderStatus] as [string, ...string[]], {
      message: 'Status must be pending | completed',
    }),
  }),
});
export const OrderValidations = {
  createOrderValidationSchema,
  updateOrderValidationSchema,
};
