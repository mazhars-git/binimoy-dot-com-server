import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import catchAsync from '../../utils/CatchAsync';
import { WishListServices } from './wishlist.service';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';

const createWishlist = catchAsync(async (req: Request, res: Response) => {
  const result = await WishListServices.createWishlistIntoDB(req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Your wishlist created successfully',
    data: result,
  });
});

const getWishlist = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const result = await WishListServices.getWishlistIntoDB(userId);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Wishlist retrieved successfully',
    data: result,
  });
});

const deleteWishlist = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const { id } = req.params;

  const result = await WishListServices.deleteWishlistFromDB(user, id);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Wishlist deleted successfully',
    data: result,
  });
});

export const WishlistController = {
  createWishlist,
  getWishlist,
  deleteWishlist,
};
