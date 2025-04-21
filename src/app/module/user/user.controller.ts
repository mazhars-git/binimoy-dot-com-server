import { Request, Response } from 'express';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import { UserServices } from './user.service';
import { JwtPayload } from 'jsonwebtoken';

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  // Get user data from request params
  const result = await UserServices.getMyProfileFromDB(req.user as JwtPayload);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  // Get user data from request params
  const { id } = req.params;
  const user = req.user as JwtPayload;
  // Create a new user
  const result = await UserServices.getSingleUserFromDB(id as string, user);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  // Get user data from request params
  const { id } = req.params;

  const user = req.user as JwtPayload;
  const result = await UserServices.updateProfile(id, req.body, user);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User profile updated successfully',
    data: result,
  });
});




const changeStatus = catchAsync(async (req, res) => {
  // Get user data from request params
  const { id } = req.params;

  const user = req.user as JwtPayload;

  if (!user) throw new Error('You are not authorized!');
  const result = await UserServices.changeStatus(id, req.body, user);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User status updated succesfully',
    data: result,
  });
});

const banUser = catchAsync(async (req, res) => {
  // Get user data from request params
  const { id } = req.params;
  const result = await UserServices.banUser(id, req.body);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User banned successfully',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  // Get user data from request params
  const { id } = req.params;
  const result = await UserServices.deleteUser(id);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

export const UserController = {
  getSingleUser,
  getMyProfile,
  getAllUsers,
  changeStatus,
  banUser,
  updateProfile,
  deleteUser,
};
