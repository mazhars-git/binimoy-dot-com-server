import status from 'http-status';
import AppError from '../../errors/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../builder/QueryBuilder';
import { userSearchableFields } from './user.constant';

const getSingleUserFromDB = async (id: string, user: JwtPayload) => {
  if (user.role !== 'admin') {
    throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');
  }
  const result = await User.findOne({ _id: id });

  if (!result) throw new AppError(status.NOT_FOUND, 'User not found');

  return result;
};

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(User.find(), query).search(
    userSearchableFields,
  );

  const meta = await userQuery.countTotal();
  const result = await userQuery.modelQuery;

  return { result, meta };
};

const getMyProfileFromDB = async (user: JwtPayload) => {
  const result = await User.findOne({ email: user.email });
  return result;
};

const updateProfile = async (
  id: string,
  payload: Partial<TUser>,
  user: JwtPayload,
) => {
  const userData = await User.findOne({ _id: id });

  if (!userData) throw new AppError(status.NOT_FOUND, 'User not found');

  if (userData.email !== user.email)
    throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');


  const allowedUpdates: (keyof TUser)[] = ['name', 'phoneNumber', 'photo'];
  const filteredUpdates: Partial<TUser> = {};

  for (const key of allowedUpdates) {
    if (key in payload) {
      filteredUpdates[key] = payload[key] as never;
    }
  }
  const updateUser = await User.findByIdAndUpdate(id, filteredUpdates, {
    new: true,
    runValidators: true,
  });
  return updateUser;
};

const changeStatus = async (
  id: string,
  payload: Partial<TUser>,
  user: JwtPayload,
) => {
  const userData = await User.findOne({ _id: id });

  if (!userData) throw new AppError(status.NOT_FOUND, 'User not found');

  if (userData.email !== user.email)
    throw new AppError(status.UNAUTHORIZED, 'You are not authorized!');

  // Ensure the user can only update name, status and shippingAddress

  const allowedUpdates: (keyof TUser)[] = ['status'];
  const filteredUpdates: Partial<TUser> = {};

  for (const key of allowedUpdates) {
    if (key in payload) {
      filteredUpdates[key] = payload[key] as never;
    }
  }
  const updateUser = await User.findByIdAndUpdate(id, filteredUpdates, {
    new: true,
    runValidators: true,
  });
  return updateUser;
};

const banUser = async (id: string, payload: Partial<TUser>) => {
  // Ensure the user can only update name, status and shippingAddress

  const allowedUpdates: (keyof TUser)[] = ['isBan'];
  const filteredUpdates: Partial<TUser> = {};

  for (const key of allowedUpdates) {
    if (key in payload) {
      filteredUpdates[key] = payload[key] as never;
    }
  }
  const updateUser = await User.findByIdAndUpdate(id, filteredUpdates, {
    new: true,
    runValidators: true,
  });
  return updateUser;
};

const deleteUser = async (id: string) => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

export const UserServices = {
  getSingleUserFromDB,
  getMyProfileFromDB,
  getAllUsersFromDB,
  changeStatus,
  banUser,
  updateProfile,
  deleteUser,
};
