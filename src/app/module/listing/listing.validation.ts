import { z } from 'zod';

// Reusable Enums
const statusEnum = z.enum(['available', 'sold']);
const conditionEnum = z.enum(['new', 'like new', 'used', 'for parts']);

const categoryEnum = z.enum([
  'Electronics',
  'Furniture',
  'Clothing & Accessories',
  'Books & Magazines',
  'Vehicles',
  'Home Appliances',
  'Sports & Outdoors',
  'Toys & Games',
  'Beauty & Personal Care',
  'Tools & Hardware',
  'Collectibles & Art',
  'Pet Supplies',
  'Musical Instruments',
  'Office Supplies & Stationery',
  'Mobile Phones & Accessories',
  'Computers & Laptops',
  'Gaming Consoles & Accessories',
  'Cameras & Photography',
  'Baby Products',
  'Jewelry & Watches',
  'Garden & Outdoor',
  'Kitchenware & Dining',
  'Health & Wellness',
  'Car Accessories & Parts',
  'Real Estate',
  'Bicycles & Accessories',
  'Tickets & Vouchers',
  'Handmade & Crafts',
  'Antiques',
  'Industrial Equipment',
  'Farming Tools & Machinery',
  'Services',
  'Other',
]);

const createListingValidationSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    description: z.string({ required_error: 'Description is required' }),
    price: z.number({ required_error: 'Price is required' }),
    condition: conditionEnum,
    category: categoryEnum,
    location: z.string({ required_error: 'Location is required' }),
    images: z.array(z.string()).optional(),
    quantity: z.number({ required_error: 'Quantity is required' }),
    status: statusEnum,
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

const updateListingValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.number().optional(),
    condition: conditionEnum.optional(),
    category: categoryEnum.optional(),
    location: z.string().optional(),
    images: z.array(z.string()).optional(),
    quantity: z.number().optional(),
    status: statusEnum.optional(),
    isActive: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const ListingValidation = {
  createListingValidationSchema,
  updateListingValidationSchema,
};
