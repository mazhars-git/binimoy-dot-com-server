import { Schema, model } from 'mongoose';
import { TListing } from './listing.interface';
import { categoryEnum, conditionEnum, statusEnum } from './listing.contant';

const listingSchema = new Schema<TListing>(
  {
    title: {
      type: String,
      required: [true, 'Listing title is required'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, 'Listing description is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Listing price is required'],
      min: [0, 'Price must be a positive number'],
    },
    condition: {
      type: String,
      required: [true, 'Listing condition is required'],
      trim: true,
      enum: {
        values: conditionEnum,
        message: '{VALUE} is not a valid condition',
      },
    },
    category: {
      type: String,
      required: [true, 'Listing category is required'],
      trim: true,
      enum: {
        values: categoryEnum,
        message: '{VALUE} is not a valid category',
      },
    },
    location: {
      type: String,
      required: [true, 'Listing location is required'],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    quantity: {
      type: Number,
      required: [true, 'Listing quantity is required'],
      min: [0, 'Quantity must be a positive number'],
    },
    status: {
      type: String,
      required: [true, 'Listing status is required'],
      enum: {
        values: statusEnum,
        message: '{VALUE} is not a valid status',
      },
    },
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Advanced query methods using query middleware
listingSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

listingSchema.pre('findOne', function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

// Create the Mongoose model
export const Listing = model<TListing>('Listing', listingSchema);
