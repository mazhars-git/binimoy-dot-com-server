import express from 'express';
import { OrderController } from './order.controller';
import validateRequest from '../../middlwares/validateRequest';
import { OrderValidations } from './order.validation';
import auth from '../../middlwares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/',
  validateRequest(OrderValidations.createOrderValidationSchema),
  OrderController.createOrder
);

router.get(
    '/verify',
    auth(USER_ROLE.user),
    OrderController.verifyPayment,
  );

  router.get('/sales/:userId', auth(USER_ROLE.user), OrderController.getSales);
  router.get('/purchase/:userId', auth(USER_ROLE.user), OrderController.getPurchase);

  router.put(
    '/:id',
    auth(USER_ROLE?.user),
    validateRequest(OrderValidations.updateOrderValidationSchema),
    OrderController.updatedOrderStatus,
  );
  

export const OrderRoutes = router;
