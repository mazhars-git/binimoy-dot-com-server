import mongoose from 'mongoose';
import { z } from 'zod';

const createWishlistValidationSchema = z.object({
  body: z.object({
    userId: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
      message: 'Invalid user Id format',
    }),

    productId: z.array(
      z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
        message: 'Invalid Product Id format',
      }),
    ),
    isDeleted: z.boolean().optional(),
  }),
});

export const wishlistValidation = {
  createWishlistValidationSchema,
};
