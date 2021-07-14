import Router from 'koa-router';
import {
  getUsers,
  getUserById,
  updateUser,
  removeUser,
  emailVerification,
} from '../controllers/user';
import passport from 'koa-passport';
const router: Router = new Router();

router.get('/', passport.authenticate('jwt', { session: false }), getUsers);

router.post(
  '/verify-email',
  passport.authenticate('jwt', { session: false }),
  emailVerification
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  getUserById
);

router.patch(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  updateUser
);

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  removeUser
);

export const usersRouter = router.routes();
