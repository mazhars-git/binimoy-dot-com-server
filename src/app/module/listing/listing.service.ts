import status from 'http-status';
import AppError from '../../errors/AppError';
import { TListing } from './listing.interface';
import { Listing } from './listing.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { listingSearchableFields } from './listing.contant';
import { JwtPayload } from 'jsonwebtoken';
import { User } from '../user/user.model';

// Create a new listing
const createListingIntoDB = async (listingData: TListing, user: JwtPayload) => {
  if (user.role !== 'user') {
    throw new AppError(
      status.FORBIDDEN,
      'You are not authorized to create a listing',
    );
  }

  const { email } = user;
  // find user by email and get user id
  const userData = await User.findOne({ email }).select('_id');
  // if user not found
  if (!userData) throw new AppError(status.NOT_FOUND, 'User not found');

  // set userID to listing data
  listingData.userID = userData._id;

  const result = await Listing.create(listingData);
  return result;
};

// Get all listings with if query search term is provided
const getAllListingsFromDB = async (query: Record<string, unknown>) => {
  const listingQuery = new QueryBuilder(
    Listing.find().select('-isDeleted'),
    query,
  )
    .search(listingSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await listingQuery.countTotal();
  const result = await listingQuery.modelQuery;

  return { result, meta };
};

// Get specific listing by id from the database
const getListingByIdFromDB = async (id: string) => {
  const result = await Listing.findById(id).select('-isDeleted');

  // if listing not found
  if (!result) throw new AppError(status.NOT_FOUND, 'Resource not found');

  return result;
};

// Get all listings of a specific user
const getMyListingsFromDB = async (
  user: JwtPayload,
  query: Record<string, unknown>,
) => {
  const { email } = user;
  // find user by email and get user id
  const userData = await User.findOne({ email }).select('_id');
  // if user not found
  if (!userData) throw new AppError(status.NOT_FOUND, 'User not found');

  const listingQuery = new QueryBuilder(
    Listing.find({ userID: userData }),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await listingQuery.countTotal();
  const result = await listingQuery.modelQuery;
  return { result, meta };
};

// Update specific listing by id from the database
const updatedListingInDB = async (
  id: string,
  updateData: Partial<TListing>,
  user: JwtPayload,
) => {
  // find user by email and get user id
  const userData = await User.findOne({ email: user.email });

  // if user not found
  if (!userData) throw new AppError(status.NOT_FOUND, 'User not found');
  // find listing by id
  const listing = await Listing.findById(id).select('-isDeleted');
  // if listing not found
  if (!listing) throw new AppError(status.NOT_FOUND, 'Resource not found');

  const isOwner = listing.userID.toString() === userData!._id.toString();

  if (!isOwner) {
    throw new AppError(
      status.FORBIDDEN,
      'You are not authorized to update this listing',
    );
  }

  const updatedListing = await Listing.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return updatedListing;
};

// Delete specific listing by id from the database
const deleteListingByIdFromDB = async (id: string, user: JwtPayload) => {
  // find user by email and get user id
  const userData = await User.findOne({ email: user.email });

  // if user not found
  if (!userData) throw new AppError(status.NOT_FOUND, 'User not found');
  // find listing by id
  const listing = await Listing.findById(id).select('-isDeleted');
  // if listing not found
  if (!listing) throw new AppError(status.NOT_FOUND, 'Resource not found');

  const isOwner = listing.userID.toString() === userData!._id.toString();
  const isAdmin = user.role === 'admin';

  if (!isOwner && !isAdmin) {
    throw new AppError(
      status.FORBIDDEN,
      'You are not authorized to update this listing',
    );
  }

  const result = await Listing.updateOne({ _id: id }, { isDeleted: true });

  return result;
};

export const ListingService = {
  createListingIntoDB,
  getAllListingsFromDB,
  getListingByIdFromDB,
  getMyListingsFromDB,
  updatedListingInDB,
  deleteListingByIdFromDB,
};
