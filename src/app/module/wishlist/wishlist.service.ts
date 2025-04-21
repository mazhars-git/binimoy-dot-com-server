import { StatusCodes } from 'http-status-codes';
import { Wishlist } from './wishlist.model';
import { User } from '../user/user.model';
import { TWishlist } from './wishlist.interface';
import AppError from '../../errors/AppError';

// CREATE Wishlist Entry
const createWishlistIntoDB = async (payload: TWishlist) => {
  const { userId, productId } = payload;

  // Check if product already in wishlist

  const alreadyExists = await Wishlist.findOne({ userId, productId, isDeleted: false });

  if (alreadyExists) {
    throw new AppError(StatusCodes.CONFLICT, 'This product is already in your wishlist.');
  }

  if (!userId) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Please log in to add items to your wishlist.');
  }

  // Validate user existence
  const userExists = await User.findById(userId);
  if (!userExists) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found.');
  }



  // Create new wishlist entry
  const wishlistItem = await Wishlist.create(payload);

  return wishlistItem;
};

// GET Wishlist Items by User
const getWishlistIntoDB = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found.');
  }

  if (user.isBan) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Your account is blocked.');
  }

  const wishlistItems = await Wishlist.find({ userId, isDeleted: false })
    .populate({
      path: 'userId',
      select: '_id name email phoneNumber role isBan',
    })
    .populate({
      path: 'productId',
      select:
        'title userID condition  price category images description status location',
    });

  if (wishlistItems.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Your wishlist is empty.');
  }

  return wishlistItems;
};

// DELETE (Soft Delete) Wishlist Item
const deleteWishlistFromDB = async (userId: string, productId: string) => {
  const wishlistItem = await Wishlist.findOne({ userId, productId });

  if (!wishlistItem) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Item not found in your wishlist.');
  }

  wishlistItem.isDeleted = true;
  await wishlistItem.save();

  return wishlistItem;
};

export const WishListServices = {
  createWishlistIntoDB,
  getWishlistIntoDB,
  deleteWishlistFromDB,
};
