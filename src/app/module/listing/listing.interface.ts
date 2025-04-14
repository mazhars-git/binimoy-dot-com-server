import { Types } from 'mongoose';

// Define possible categories
export type Category =
  | 'Electronics'
  | 'Furniture'
  | 'Clothing & Accessories'
  | 'Books & Magazines'
  | 'Vehicles'
  | 'Home Appliances'
  | 'Sports & Outdoors'
  | 'Toys & Games'
  | 'Beauty & Personal Care'
  | 'Tools & Hardware'
  | 'Collectibles & Art'
  | 'Pet Supplies'
  | 'Musical Instruments'
  | 'Office Supplies & Stationery'
  | 'Mobile Phones & Accessories'
  | 'Computers & Laptops'
  | 'Gaming Consoles & Accessories'
  | 'Cameras & Photography'
  | 'Baby Products'
  | 'Jewelry & Watches'
  | 'Garden & Outdoor'
  | 'Kitchenware & Dining'
  | 'Health & Wellness'
  | 'Car Accessories & Parts'
  | 'Real Estate'
  | 'Bicycles & Accessories'
  | 'Tickets & Vouchers'
  | 'Handmade & Crafts'
  | 'Antiques'
  | 'Industrial Equipment'
  | 'Farming Tools & Machinery'
  | 'Services'
  | 'Other';

// Define condition and status types for better semantics and control
export type Condition = 'new' | 'like new' | 'used' | 'for parts';
export type Status = 'available' | 'sold';

// Listing type definition
export type TListing = {
  title: string;
  description: string;
  price: number;
  condition: Condition;
  category: Category;
  quantity: number;
  status: Status;
  userID: Types.ObjectId;
  location: string;
  images?: string[];
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
