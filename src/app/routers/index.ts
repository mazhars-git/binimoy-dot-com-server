import { Router } from 'express';
import { UserRoutes } from '../module/user/user.route';
import { ListingRoutes } from '../module/listing/listing.route';
import { AuthRoutes } from '../module/auth/auth.route';
import { wishlistRoutes } from '../module/wishlist/wishlist.route';
import { MessageRoutes } from '../module/messages/messages.route';
import { OrderRoutes } from '../module/order/order.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/listings',
    route: ListingRoutes,
  },
  {
    path: '/wishlish',
    route: wishlistRoutes,
  },
  {
    path: '/message',
    route: MessageRoutes,
  },
  {
    path: '/order',
    route: OrderRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
