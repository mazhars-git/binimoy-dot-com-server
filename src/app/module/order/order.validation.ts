import mongoose from 'mongoose';
import { z } from 'zod';
import { TOrderStatus } from './order.constant';

//Order validation schema
const createOrderValidationSchema = z.object({
  body: z.object({
    product: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid product id ',
    }),
    address: z.string().min(3, {
      message: 'Address cannot be empty. Please enter your address',
    }),
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
