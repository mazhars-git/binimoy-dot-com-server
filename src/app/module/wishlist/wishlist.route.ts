import express from 'express';
import { WishlistController } from './wishlist.controller';
import auth from '../../middlwares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlwares/validateRequest';
import { wishlistValidation } from './wishlist.validation';


const router = express.Router();

router.get('/:userId', WishlistController.getWishlist);

router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(wishlistValidation.createWishlistValidationSchema),
  WishlistController.createWishlist,
);

router.delete(
  '/:id',
  auth( USER_ROLE.user),
  WishlistController.deleteWishlist,
);

export const wishlistRoutes = router;
