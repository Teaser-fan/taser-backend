import Router from 'koa-router';
import { categoriesRouter } from './categories';
import { ordersRouter } from './orders';
import { productsRouter } from './products';
import { usersRouter } from './user';
import { authRouter } from './auth';
import passport from '../passport';
const router: Router = new Router();

router.prefix('/api/v1');

/**
 * Base route, return a 401
 */
router.get('/', async (ctx) => (ctx.status = 401));

/**
 * Basic healthcheck
 */
router.get('/healthcheck', async (ctx) => (ctx.body = 'OK'));

router.use('/auth',authRouter);

router.use('/products', passport.authenticate('jwt', { session: false }), productsRouter);

router.use('/categories', passport.authenticate('jwt', { session: false }),categoriesRouter);

router.use('/orders', passport.authenticate('jwt', { session: false }),ordersRouter);

router.use('/users', passport.authenticate('jwt', { session: false }), usersRouter);

export const routes = router.routes();
