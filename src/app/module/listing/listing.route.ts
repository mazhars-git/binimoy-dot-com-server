import express from 'express';
import { ListingController } from './listing.controller';
import auth from '../../middlwares/auth';
import { USER_ROLE } from '../user/user.constant';
import validateRequest from '../../middlwares/validateRequest';
import { ListingValidation } from './listing.validation';

const router = express.Router();

router.get('/', ListingController.getAllListings);

router.get(
  '/my-listings',
  auth(USER_ROLE.user, USER_ROLE.admin),
  ListingController.myListings,
);

router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(ListingValidation.createListingValidationSchema),
  ListingController.createListing,
);

router.get('/:id', ListingController.getListingById);

router.put(
  '/:id',
  auth(USER_ROLE.user),
  validateRequest(ListingValidation.updateListingValidationSchema),
  ListingController.updateListing,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  ListingController.deleteListing,
);

export const ListingRoutes = router;
