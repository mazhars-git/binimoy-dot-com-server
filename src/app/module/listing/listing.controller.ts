import { Response, Request } from 'express';
import { ListingService } from './listing.service';
import catchAsync from '../../utils/CatchAsync';
import sendResponse from '../../utils/sendResponse';
import status from 'http-status';
import { JwtPayload } from 'jsonwebtoken';

// Get all products
const getAllListings = catchAsync(async (req: Request, res: Response) => {
  // Fetch listings from the database
  const result = await ListingService.getAllListingsFromDB(req.query);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Listings retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

// Create a new listing
const createListing = catchAsync(async (req: Request, res: Response) => {
  // Get listing data from request body
  const listingData = req.body;
  const user = req.user as JwtPayload;

  const result = await ListingService.createListingIntoDB(listingData, user);

  // Send response
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: 'Listing created successfully',
    data: result,
  });
});

// Get a specific listing by id
const getListingById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Fetch listing from the database
  const result = await ListingService.getListingByIdFromDB(id);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Listing retrieved successfully',
    data: result,
  });
});

// Get all listings of a specific user
const myListings = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;
  const query = req.query as Record<string, unknown>;

  // Fetch listings from the database
  const result = await ListingService.getMyListingsFromDB(user, query);

  // Send response
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Listings retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

// Update a specific listing by id
const updateListing = catchAsync(async (req: Request, res: Response) => {
  // Get product data from request body
  const { id } = req.params;
  const updateData = req.body;
  const user = req.user as JwtPayload;

  // Update listing in the database
  const updatedListing = await ListingService.updatedListingInDB(
    id,
    updateData,
    user,
  );

  // if listing not found in the database
  if (!updatedListing) {
    sendResponse(res, {
      statusCode: status.NOT_FOUND,
      success: false,
      message: 'Resource not found',
      data: null,
    });
  }

  // if listing found in the database
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Listing updated successfully',
    data: updatedListing,
  });
});

// Delete a specific listing by id
const deleteListing = catchAsync(async (req: Request, res: Response) => {
  // Get listing id from request params
  const { id } = req.params;
  const user = req.user as JwtPayload;

  // Delete listing from the database
  const deletedListing = await ListingService.deleteListingByIdFromDB(id, user);

  // if listing not found in the database
  if (!deletedListing) {
    sendResponse(res, {
      statusCode: status.NOT_FOUND,
      success: false,
      message: 'Resource not found',
      data: null,
    });
  }

  // if listing found in the database
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: 'Listing deleted successfully',
    data: {},
  });
});

export const ListingController = {
  createListing,
  getAllListings,
  getListingById,
  myListings,
  updateListing,
  deleteListing,
};
