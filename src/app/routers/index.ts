import { Router } from 'express';
import { UserRoutes } from '../module/user/user.route';
import { ListingRoutes } from '../module/listing/listing.route';
import { AuthRoutes } from '../module/auth/auth.route';

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
