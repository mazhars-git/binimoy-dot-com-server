import express from 'express';
import auth from '../../middlwares/auth';
import validateRequest from '../../middlwares/validateRequest';
import { messageValidation } from './messages.validation';
import { USER_ROLE } from '../user/user.constant';
import { messageController } from './messages.controller';


const router = express.Router();


router.post(
  '/',
  auth(USER_ROLE.user),
  validateRequest(messageValidation.createMessageValidationSchema),
  messageController.createMessage,
);

router.get(
    '/:userA/:userB',
    messageController.getMessage
  );


export const MessageRoutes = router;
