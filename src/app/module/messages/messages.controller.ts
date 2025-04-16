import { Request, Response } from 'express';
import catchAsync from '../../utils/CatchAsync';
import { MessageService } from './messages.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const createMessage = catchAsync(async (req: Request, res: Response) => {
  const result = await MessageService.createMessagesBetweenUsers(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: 'messages created successfully',
    data: result,
  });
});

const getMessage = catchAsync(async (req: Request, res: Response) => {
  const { userA, userB } = req.params;

  const result = await MessageService.getMessagesBetweenUsers(userA, userB);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'messages fetched successfully',
    data: result,
  });
});



export const messageController = {
  createMessage,
  getMessage,
};