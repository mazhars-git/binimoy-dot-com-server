import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import { OrderService } from './order.service';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/CatchAsync';
import { JwtPayload } from 'jsonwebtoken';

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const result = await OrderService.createOrderIntoDB(
    req.user as JwtPayload,
    req.body,
  );



  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Order placed successfully. Redirect to ShurjoPay checkout URL.',
    data: {
      checkout_url: result,
    },
  });
});


const verifyPayment = catchAsync(async (req, res) => {
  const order = await OrderService.verifyPayment(req.query.order_id as string);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Order verified successfully',
    data: order,
  });
});

const getSales = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await OrderService.getSalesOfUserFromDB(userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'User Sales retrieved successfully',
    data: result,
  });
});


const getPurchase = catchAsync(async (req, res) => {
    const { userId } = req.params;
    const result = await OrderService.getPurchaseOfUserFromDB(userId);
  
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'User Purchase retrieved successfully',
      data: result,
    });
});
const updatedOrderStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await OrderService.updateOrderStatus(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Order Update successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  verifyPayment,
  getPurchase,
  getSales,
  updatedOrderStatus,
};
