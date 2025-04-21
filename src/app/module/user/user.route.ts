import { Router } from 'express';
import { UserController } from './user.controller';
import auth from '../../middlwares/auth';
import { USER_ROLE } from './user.constant';
import { UserValidation } from './user.validation';
import validateRequest from '../../middlwares/validateRequest';

const router = Router();

router.get('/', auth(USER_ROLE.admin), UserController.getAllUsers);

router.get(
  '/me',
  auth(USER_ROLE.user, USER_ROLE.admin),
  UserController.getMyProfile,
);

router.get('/:id',  auth(USER_ROLE.admin), UserController.getSingleUser);

router.put(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.user),
  validateRequest(UserValidation.updateProfileValidationSchema),
  UserController.updateProfile,
);

router.post(
  '/:id/ban',
  auth(USER_ROLE.admin),
  validateRequest(UserValidation.changeBlockValidationSchema),
  UserController.banUser,
);

router.post(
  '/change-status/:id',
  auth(USER_ROLE.user),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserController.changeStatus,
);

router.delete('/:id', auth(USER_ROLE.admin), UserController.deleteUser);

export const UserRoutes = router;
